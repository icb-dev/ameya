import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, Scrollbar } from 'swiper/modules';
import { 
  Plus, Minus, MapPin, Building2, ChevronLeft, ChevronRight, 
  ArrowUpRight, Download, Phone, Layout, ShieldCheck, Waves, X,
  Calendar, Maximize2, CheckCircle2, Play, Map as MapIcon, Clock, Eye, Send,
  Image as ImageIcon, // Add this
  Video as VideoIcon  // Add this
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getProjectBySlug, getProjectSections } from '../../services/projectService';
// import ContactCTA from "../components/ContactCTA";
// --- Assets ---
import residencelogo from '../assets/images/residencelogo1.png'; 
import sapphirefeatured from '../assets/images/SR1.png';  
import fr from "../assets/images/fr.png"; 
import SR1 from "../assets/images/SR1.png"; 
import SR2 from "../assets/images/SR2.png";
import SR3 from "../assets/images/SR3.png";
import SR4 from "../assets/images/SR4.png";
import SR5 from "../assets/images/SR5.png";
import SR6 from "../assets/images/SR6.png";
import SR7 from "../assets/images/SR7.png";
import SR8 from "../assets/images/SR8.png";
import SR9 from "../assets/images/SR9.png"; 
import SR10 from "../assets/images/SR10.jpg";
import SR11 from "../assets/images/SR11.jpg";
import SR12 from "../assets/images/SR12.png";
import SR13 from "../assets/images/SR13.jpg";
import SR14 from "../assets/images/SR14.jpg";
import SR15 from "../assets/images/SR15.jpg";
import SR16 from "../assets/images/SR16.jpg";
import SR17 from "../assets/images/SR17.jpg";
import SR18 from "../assets/images/SR18.jpg";
import SR19 from "../assets/images/SR19.jpg";
import SR20 from "../assets/images/SR20.jpg"; 
import pfloorplans from "../assets/images/pfloorplans.jpg"; 

// --- Swiper Styles ---
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/scrollbar';
 
const Resipage = () => {

  // ===================================================
  console.log("--- Resipage Component has Mounted! ---");  
  // ===================================================
  
  // --- 1. STATE MANAGEMENT ---
  const [loading, setLoading] = useState(true);
  
  // Dynamic Data States (Initialize with empty structures to prevent crash)
  const [heroData, setHeroData] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  const [projectInfo, setProjectInfo] = useState({ sector: '', city: '' });
  const [highlightsData, setHighlightsData] = useState([]);
  const [immersiveData, setImmersiveData] = useState(null);
  const [amenitiesData, setAmenitiesData] = useState({ "All Amenities": [] }); 
  const [locationAdvantages, setLocationAdvantages] = useState({}); 
  const [locationData, setLocationData] = useState({ locations: [], map_url: "" }); // section_type: "location" (slider list)
  const [locationTab, setLocationTab] = useState("");
  const [unitLayouts, setUnitLayouts] = useState({}); 
  const [galleryData, setGalleryData] = useState({ images: [], videos: [] });
  const [faqData, setFaqData] = useState([]);
  const [reraNumber, setReraNumber] = useState("");
  const [premierOfferings, setPremierOfferings] = useState({
  Active: [],
  Community: [],
  Recreational: []
  });
  console.log("Check Connectivity State:", locationAdvantages);
  // Existing UI States
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('VR');

  const [galleryTab, setGalleryTab] = useState('IMAGES'); 
  const [galleryVisibleCount, setGalleryVisibleCount] = useState(3);
  const [gallerySelectedItem, setGallerySelectedItem] = useState(null);

  // popup
  const [isFormOpen, setIsFormOpen] = useState(false);
const [formContext, setFormContext] = useState({ title: "", type: "" });

// Function to open form with specific data
const openContactForm = (title, type) => {
  setFormContext({ title, type });
  setIsFormOpen(true);
};
  
  // We need to set the first tab dynamically after data loads, 
  // but for now default to 'All Amenities' for the new structure
  const [offeringTab, setOfferingTab] = useState('All Amenities'); 
  const [layoutTab, setLayoutTab] = useState(''); // Will set after fetch
  const [activePhoto, setActivePhoto] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bannerY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);

  // Normalize YouTube URL to embed format
  const rawImmersiveUrl = immersiveData?.url || immersiveData?.url1 || "";
  const immersiveUrl = React.useMemo(() => {
    if (!rawImmersiveUrl) return "";

    try {
      const url = new URL(rawImmersiveUrl);

      // Already an embed URL
      if (url.hostname.includes("youtube.com") && url.pathname.startsWith("/embed/")) {
        return rawImmersiveUrl;
      }

      // Convert youtube.com/watch?v= to embed
      if (url.hostname.includes("youtube.com") && url.pathname === "/watch") {
        const videoId = url.searchParams.get("v");
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // Convert youtu.be/ to embed
      if (url.hostname === "youtu.be") {
        const videoId = url.pathname.replace("/", "");
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      return rawImmersiveUrl;
    } catch {
      return rawImmersiveUrl;
    }
  }, [rawImmersiveUrl]);


  // --- 2. DATA FETCHING & MAPPING ---
  const { slug } = useParams();

  useEffect(() => {
    if (!slug) {
      console.warn("No slug provided for residential project");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      // ===================================================
      console.log("--- Fetching residential project by slug:", slug);
      // ===================================================

      try {
        // First, get project by slug to get the project ID
        const projectData = await getProjectBySlug(slug);
        
        if (!projectData || !projectData.id) {
          console.error("Project not found for slug:", slug);
          setLoading(false);
          return;
        }

        console.log("--- Project data:", projectData);
        
        // Then fetch sections using project ID
        const rawData = await getProjectSections(projectData.id);
        
        console.log("--- Sections data:", rawData);

        // 1. Sort by position
        const sortedSections = rawData.sort((a, b) => a.position - b.position);

        // 2. Map data to state
        sortedSections.forEach(section => {
          // Parse the stringified JSON "data" field
          const content = typeof section.data === 'string' ? JSON.parse(section.data) : section.data;

          switch (section.section_type) {
            case 'hero':
              setHeroData(content);
              break;

            case 'overview':
              setOverviewData(content); 
              setProjectInfo({
                sector: content.sector || "", // Fallback to empty string if not found
                city: content.city || ""
              });
              break;
              

            case 'project_highlights':
              // Backend: { items: [{title, description, image}] }
              setHighlightsData(content.items || []);
              break;

            case 'immersive_tour':
            if (content) {
              try {
                // Parse the stringified 'data' field
                const rawData = content.data ? content.data : content;
                const parsedData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
                
                setImmersiveData(parsedData);
              } catch (e) {
                console.error("Error parsing immersive tour data:", e);
              }
            }
            break;

            case 'amenities':
            // 1. Map the backend "items" into the format your slider expects
            const mappedItems = content.items.map(item => ({
              title: item.name,
              img: item.image
            }));
            
            // 2. Update premierOfferings so the Swiper .map() has data to read
            setPremierOfferings({
              "Active": mappedItems, 
              "Community": [],
              "Recreational": []
            });

            // 3. Set the active tab to "Active" so something shows up immediately
            setOfferingTab("Active");
            break;

           case 'location_advantage':
            if (content) {
              // section_type "location_advantage": map + optional locations
              setLocationAdvantages({
                map_location: content.map_location || content.map_url || "",
                locations: Array.isArray(content.locations) ? content.locations : []
              });
              console.log("Location advantages set:", {
                map_location: content.map_location,
                locations: content.locations
              });
            }
            break;

            case 'location':
              if (content) {
                // section_type "location": locations list for connectivity slider
                setLocationData({
                  locations: Array.isArray(content.locations) ? content.locations : [],
                  map_url: content.map_url || ""
                });
                console.log("Location (slider) set:", content.locations);
              }
              break;

            case 'unit_layout': // Matches your API section_type
            if (content) {
              try {
                // 1. Get the data string (handle case where it might already be an object)
                const rawData = content.data ? content.data : content;
                
                // 2. Parse the stringified JSON
                const parsedData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
                
                // 3. Set the state to the 'items' array inside that data
                setUnitLayouts(parsedData.items || []); 
                console.log("Unit Layouts Updated:", parsedData.items);
              } catch (e) {
                console.error("Error parsing floor plans:", e);
              }
            }
            break; 

           // Inside your fetchData switch/case logic:
            case 'gallery':
            if (content) {
              try {
                const rawData = content.data ? content.data : content;
                const parsedData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
                
                const formattedVideos = (parsedData.youtube_links || []).map((link, index) => {
                  // Extract YouTube ID (works for embed links and standard links)
                  const videoId = link.split('/').pop().split('?')[0];
                  // Generate high-res thumbnail URL
                  const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

                  return {
                    id: index,
                    thumb: thumbUrl, // Now uses the actual video thumbnail
                    title: `Project Video ${index + 1}`,
                    url: link
                  };
                });

                setGalleryData({
                  images: parsedData.images || [],
                  videos: formattedVideos
                });
              } catch (e) {
                console.error("Gallery Parsing Error:", e);
              }
            }
            break;

            case 'faqs':
            if (content) {
              try {
                // 1. Extract the raw string from 'data' property
                const rawData = content.data ? content.data : content;
                
                // 2. Parse the string into an object
                const parsedData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
                
                // 3. Map the items to match your 'q' and 'a' keys used in the UI
                if (parsedData && parsedData.items) {
                  setFaqData(parsedData.items.map(i => ({ 
                    q: i.question, 
                    a: i.answer 
                  })));
                }
              } catch (e) {
                console.error("FAQ Parsing Error:", e);
              }
            }
            break;

            case 'rera':
              if (content && content.rera) {
                setReraNumber(content.rera);
              }
              break;
              
            default:
              break;
          }
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-blue-100">
      
       
      {/* SECTION 1: HERO */}
<section
  ref={heroRef}
  className="relative w-full h-[100vh] sm:h-[90vh] md:h-screen flex items-end justify-center overflow-hidden bg-gray-900"
>
  <motion.div style={{ y: bannerY }} className="absolute inset-0 z-0">
    <motion.img
      initial={{ scale: 1.3 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
      src={heroData?.background_banner || sapphirefeatured}
      className="w-full h-[120%] object-cover"
      alt="Project Hero Banner"
      onError={(e) => { e.target.src = sapphirefeatured; }} 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/20 to-transparent" />
  </motion.div>

  <div
    className="
      relative z-10 max-w-[1450px] mx-auto w-full px-6 text-center
      mb-[50%] sm:mb-[24%] md:mb-[14%] lg:mb-[10%]
      flex flex-col justify-center items-center
    "
  >
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ delay: 0.6, duration: 1 }}
    > 
      <div className="w-full flex justify-center">
        <img
          src={heroData?.logo || residencelogo}
          className="
            w-[200px] xs:w-[220px] sm:w-[260px]
            md:w-[400px] lg:w-[300px] xl:w-[350px]
            h-auto object-contain
          "
          alt="Project Logo"
          onError={(e) => { e.target.src = residencelogo; }}
        />
      </div>

      {/* HIGHLIGHTED RERA NUMBER SECTION */}
      {reraNumber && (
        <div className="flex justify-center mb-1">
          <span
            className="
              inline-block
              px-3 py-1 md:px-5 md:py-2.5
              bg-black/40 backdrop-blur-md
              border border-white rounded-full
              shadow-[0_4px_15px_rgba(0,0,0,0.2)]
            "
          >
            <h1 
              className="
                text-white font-medium NeueHaasDisplay-Roman uppercase
                text-[9px] sm:text-[10px] md:text-[12px]
                tracking-[0.1em] md:tracking-[0.1em]
                leading-none
              "
            >
              <span className="opacity-60 mr-1 md:mr-2">RERA:</span> {reraNumber}
            </h1>
          </span>
        </div>
      )}


    </motion.div>
  </div>
</section>
       
      {/* SECTION 2: OVERVIEW */}
      <section className="py-16 sm:py-20 md:py-24 md:py-32 bg-white flex justify-center overflow-hidden">
        <div className="w-full max-w-[1450px] px-5 sm:px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            
            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col"
            >
              <h2
                className="
                  font-serif PlayfairDisplay tracking-tight text-black mb-4
                  xs:text-[22px] text-[28px] md:text-[34px] lg:text-[38px] xl:text-[48px]
                "
              >
                {overviewData?.heading || "Sapphire Residences"}
              </h2>

                {/* <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-50 rounded-full text-[#28659b]">
                  <MapPin size={16} />
                </div>
                <span className="text-sm font-bold uppercase tracking-wider text-gray-600 NeueHaasDisplay-Bold"> 
                {projectInfo.sector && projectInfo.city ? ", " : ""}
              </span>
              </div>   */}

              <p
                className="
                  text-black CadillacGothic-Regular font-light
                  text-[13px] sm:text-[14px]
                  leading-[1.6] md:leading-[1.4]
                  mb-8 md:mb-10 text-justify
                "
              >
                {overviewData?.description}
              </p>

              {/* FEATURES GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-8 gap-y-8 md:gap-y-10 mb-10 md:mb-12">
               {overviewData?.key_features?.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg text-[#28659b]">
                        <CheckCircle2 size={22} /> {/* Using generic icon as backend doesn't map icons */}
                      </div>
                      <p className="CadillacGothic-Regular text-sm font-semibold text-black leading-snug">
                        {feature}
                      </p>
                  </div>
                ))}
              </div>

              {/* CTA BUTTONS */}
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <button onClick={() => openContactForm("Enquire Now", "brochure_download")} className="flex items-center gap-3 bg-[#28659b] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold uppercase text-[12px] sm:text-[14px] tracking-widest hover:bg-black transition-all CadillacGothic-Regular">
                  Enquire Now <ArrowUpRight size={18} />
                </button>

                <button onClick={() => openContactForm("Download Brochure", "brochure_download")} className="flex items-center gap-3 border-2 border-[#28659b] text-[#28659b] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold uppercase text-[12px] sm:text-[14px] tracking-widest hover:bg-[#28659b] hover:text-white transition-all CadillacGothic-Regular">
                  Download Brochure <Download size={18} />
                </button>
              </div>
            </motion.div>

            {/* RIGHT SLIDER */}
            <motion.div className="relative aspect-[4/3] sm:aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group overview-slider-container">
              <Swiper
                modules={[Autoplay, EffectFade, Pagination]}
                effect="fade"
                speed={1000}
                autoplay={{ delay: 4000 }}
                pagination={{
                  clickable: true,
                  el: '.custom-overview-pagination'
                }}
                className="w-full h-full"
              >
                <SwiperSlide>
                  <img src={overviewData?.image || sapphirefeatured} className="w-full h-full object-cover" />
              </SwiperSlide>

                {/* ✅ Pagination – SAME AS ORIGINAL */}
                {/* <div className="custom-overview-pagination absolute !bottom-6 !right-6 !left-auto !w-auto z-30 flex gap-2"></div> */}
              </Swiper>
            </motion.div>

          </div>
        </div>

        {/* PAGINATION STYLES (UNCHANGED) */}
        {/* <style
          dangerouslySetInnerHTML={{
            __html: `
            .overview-slider-container .swiper-pagination-bullet {
              width: 10px;
              height: 10px;
              background: #fff;
              opacity: 0.5;
              border-radius: 50%;
            }
            .overview-slider-container .swiper-pagination-bullet-active {
              width: 30px;
              background: #fff;
              opacity: 1;
              border-radius: 5px;
            }
          `,
          }}
        /> */}
      </section>  
       
      {/* SECTION 3: HIGHLIGHTS */}
      <section className="bg-[#f8f9fa] py-16 sm:py-20 md:py-24 flex flex-col items-center justify-center overflow-hidden">
        <div className="max-w-[1450px] mx-auto w-full px-5 sm:px-6">
          
          {/* HEADING */}
          <div className="mb-10 md:mb-12">
            <h2
              className="
                font-serif PlayfairDisplay tracking-tight text-black
                xs:text-[22px] text-[28px] md:text-[34px] lg:text-[38px] xl:text-[48px]
              "
            >
              Lifestyle Highlights
            </h2>
          </div>

          {/* SLIDER */}
          <div className="relative w-full">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 1.5 }
              }}
              speed={1000}
              navigation={{
                nextEl: '.h-next',
                prevEl: '.h-prev'
              }}
              className="rounded-2xl h-[350px] sm:h-[300px] md:h-[500px]"
            >
              {(highlightsData || []).map((item, idx) => (
                <SwiperSlide
                  key={idx}
                  className="group cursor-pointer"
                  onClick={() => {
                    setActivePhoto(idx);
                    setLightboxOpen(true);
                  }}
                >
                  <div className="relative w-full h-full overflow-hidden rounded-2xl bg-slate-200">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      alt={item.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent z-10" />
                    
                    <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-6 sm:left-8 md:left-12 z-20 text-white pr-6 sm:pr-8 md:pr-10">
                      <h3 className="text-[22px] sm:text-2xl md:text-3xl font-bold mb-2 md:mb-3 tracking-tight PlayfairDisplay">
                        {item.title}
                      </h3>
                      <p className="text-[13px] sm:text-[14px] md:text-[16px] opacity-80 font-light CadillacGothic-Regular">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* NAVIGATION BUTTONS */}
            <div className="flex gap-3 sm:gap-4 mt-8 md:mt-10">
              <button className="h-prev w-12 h-12 md:w-14 md:h-14 rounded-full border border-black-500 flex items-center justify-center bg-white hover:bg-[#28659b] hover:text-white transition-all shadow-md z-30 cursor-pointer">
                <ChevronLeft size={22} />
              </button>
              <button className="h-next w-12 h-12 md:w-14 md:h-14 rounded-full border border-black-500 flex items-center justify-center bg-white hover:bg-[#28659b] hover:text-white transition-all shadow-md z-30 cursor-pointer">
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>
      </section>   
       
      {/* SECTION 4: IMMERSIVE TOUR */}   
      <section className="py-16 sm:py-20 md:py-24 bg-white flex flex-col items-center overflow-hidden">
        <div className="max-w-[1450px] w-full px-5 sm:px-6">
          
          {/* HEADER */}
          <div
            className="
              flex flex-col items-center text-center
              lg:flex-row lg:items-center lg:justify-between lg:text-left
              mb-10 md:mb-12 gap-4 sm:gap-6
            "
          >
            {/* TITLE */}
            <h2
              className="
                font-serif PlayfairDisplay tracking-tight text-black
                xs:text-[22px] text-[28px] md:text-[34px] lg:text-[38px] xl:text-[48px]
              "
            >
              Immersive Tour
            </h2>
          </div> 
        
          {/* VIDEO COLUMN */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden group shadow-2xl bg-slate-100">
            <div className="absolute inset-0">
              {/* BACKGROUND IMAGE: Uses backend image, or a fallback if empty */}
              <img
                src={immersiveData?.image || sapphirefeatured}
                className="w-full h-full object-cover"
                alt="Immersive Tour Preview"
              />

              {/* PLAY BUTTON OVERLAY: Always visible if immersive URL exists */}
              {immersiveUrl && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <button
                    onClick={() => {
                      // Open video popup with the normalized URL
                      setVideoOpen(true);
                    }}
                    className="bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white text-white transition-transform duration-500 hover:scale-110 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32"
                  >
                    <Play fill="white" size={40} className="md:w-12 md:h-12" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: PREMIER OFFERINGS */} 
      <section className="py-16 sm:py-20 md:py-24 bg-[#f1f8ff] flex flex-col items-center overflow-hidden">
        <div className="max-w-[1450px] w-full px-5 sm:px-6">
          
          {/* HEADER */}
          <div
            className="
              flex flex-col items-center text-center
              lg:flex-row lg:items-center lg:justify-between lg:text-left
              mb-10 md:mb-12 gap-4 sm:gap-6
            "
          >
            {/* TITLE */}
            <h2
              className="
                font-serif PlayfairDisplay tracking-tight text-black
                xs:text-[22px] text-[28px] md:text-[34px] lg:text-[38px] xl:text-[48px]
              "
            >
              Premier Offerings
            </h2>

            {/* TABS HAVE BEEN REMOVED FROM HERE */}
          </div>

          {/* SLIDER */}
          <div className="relative w-full group overflow-visible">
            <Swiper
              key="premier-offerings-slider"
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={1.1}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              breakpoints={{ 768: { slidesPerView: 3 } }}
              navigation={{ nextEl: '.offering-next', prevEl: '.offering-prev' }}
              className="overflow-visible"
            >
              {/* FLATTENED MAPPING: 
                We take all categories (Active, Community, Recreational) 
                and merge them into one single list for the slider.
              */}
              {(premierOfferings ? Object.values(premierOfferings).flat() : []).map((item, idx) => (
                <SwiperSlide key={`offering-${idx}`} className="h-full">
                  <div className="relative aspect-[1/1] rounded-xl overflow-hidden group/item cursor-pointer shadow-lg">
                    <img
                      src={item.img || item.image}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                      alt={item.title}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/600?text=Amenity"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h4 className="text-white text-[20px] sm:text-[22px] font-bold tracking-tight CadillacGothic-Regular">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* NAVIGATION */}
            <div className="flex gap-3 sm:gap-4 mt-8 md:mt-10 justify-center lg:justify-start">
              <button className="offering-prev w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center bg-white hover:bg-[#28659b] hover:text-white transition-all shadow-sm z-30 cursor-pointer">
                <ChevronLeft size={20} />
              </button>
              <button className="offering-next w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center bg-white hover:bg-[#28659b] hover:text-white transition-all shadow-sm z-30 cursor-pointer">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section> 
 
      {/* SECTION 6: CONNECTIVITY */}
      <section className="py-16 sm:py-20 md:py-24 bg-white flex flex-col items-center overflow-hidden">
        <div className="max-w-[1450px] w-full px-5 sm:px-6">
          
          {/* HEADING */}
          <div className="mb-10 md:mb-12">
            <h2 className="font-serif PlayfairDisplay tracking-tight text-black xs:text-[22px] text-[28px] md:text-[34px] lg:text-[38px] xl:text-[48px]">
              Connectivity
            </h2>
          </div>

          {/* MAP */}
          <div className="w-full h-[300px] sm:h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-xl mb-10 md:mb-12 border border-slate-100 bg-slate-50">
            {(() => {
              const defaultMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.502840858685!2d77.03866857528257!3d28.46439957575701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19fabac453f3%3A0xe4a0b2ea56b4e62!2sSapphire%20Residences!5e0!3m2!1sen!2sin!4v1769669998293!5m2!1sen!2sin";
              const mapUrl = locationAdvantages?.map_location || defaultMapUrl;
              
              // Validate map URL
              const isValidUrl = mapUrl && (
                mapUrl.startsWith('http://') || 
                mapUrl.startsWith('https://') || 
                mapUrl.startsWith('//')
              ) && !mapUrl.includes('.js') && mapUrl.length > 20;
              
              const finalMapUrl = isValidUrl ? mapUrl : defaultMapUrl;
              
              console.log("Map URL:", finalMapUrl, "from locationAdvantages:", locationAdvantages);
              
              return (
                <iframe
                  src={finalMapUrl}
                  className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                ></iframe>
              );
            })()}
          </div>

          {/* LOCATION SLIDER */}
          <div className="w-full relative connectivity-slider-container">
            <Swiper
              modules={[Scrollbar]}
              spaceBetween={16}
              slidesPerView={1.2}
              scrollbar={{ draggable: true, el: '.custom-scrollbar' }}
              breakpoints={{
                640: { slidesPerView: 2.2 },
                768: { slidesPerView: 2.5 },
                1024: { slidesPerView: 5 }
              }}
              className="pb-6"
            >
              {/* Locations from section_type "location" (not location_advantage) */}
              {(() => {
                const list = locationData?.locations || [];

                if (list && list.length > 0) {
                  return list.map((item, idx) => (
                    <SwiperSlide key={idx}>
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="flex flex-col gap-3 p-5 sm:p-6 rounded-2xl bg-[#dbdad6] border border-slate-100 transition-all duration-300 hover:bg-white hover:shadow-lg h-full mb-4"
                      >
                        <div>
                          <h4 className="font-bold text-black text-sm sm:text-base leading-tight mb-1 CadillacGothic-Regular">
                            {item.name || item.place || "Location"}
                          </h4>
                          <p className="text-[#28659b] text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                            {item.distance_time || item.time || "Distance on request"}
                          </p>
                        </div>
                      </motion.div>
                    </SwiperSlide>
                  ));
                }

                return <div className="text-gray-400 py-10">Waiting for data...</div>;
              })()}
            </Swiper>

            {/* SCROLLBAR */}
            <div className="w-full px-1">
              <div className="custom-scrollbar h-1 bg-slate-100 rounded-full relative"></div>
            </div>
          </div>
  </div> 

        <style dangerouslySetInnerHTML={{ __html: `
          .connectivity-slider-container .swiper-scrollbar-drag {
            background: #28659b !important;
            height: 100%;
            border-radius: 99px;
            cursor: grab;
          }
          .connectivity-slider-container .swiper-scrollbar {
            background: #f1f5f9;
            height: 4px;
            position: relative !important;
            margin-top: 4px;
          }
        `}} />
      </section> 
      
      {/* SECTION 7: UNIT LAYOUTS */} 
      <section className="py-16 sm:py-20 md:py-24 bg-white flex flex-col items-center overflow-hidden">
      <div className="max-w-[1450px] w-full px-5 sm:px-6">
        
        {/* HEADER - Simplified without tabs */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left mb-12 md:mb-16">
          <h2
            className="
              font-serif PlayfairDisplay tracking-tight text-black
              xs:text-[22px] text-[28px] md:text-[34px] lg:text-[38px] xl:text-[48px]
            "
          >
            Unit Layouts
          </h2>
          <div className="w-20 h-1 bg-[#28659b] mt-4"></div>
        </div>

        {/* SLIDER */}
        <div className="relative w-full">
          <Swiper
            modules={[Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            navigation={{
              nextEl: '.layout-next',
              prevEl: '.layout-prev'
            }}
            className="overflow-visible"
          >
            {/* SAFE MAPPING: 
              We use Object.values().flat() to combine all 2BHK, 3BHK, 4BHK 
              into one single simple list.
            */}
            {(Array.isArray(unitLayouts) ? unitLayouts : []).map((layout, idx) => (
                <SwiperSlide key={idx}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 hover:border-blue-100 transition-all duration-500 hover:shadow-2xl overflow-hidden"
                  >
                    {/* IMAGE */}
                    <div className="relative aspect-[4/3] mb-6 sm:mb-8 overflow-hidden rounded-2xl bg-slate-50 flex items-center justify-center p-4">
                      <img
                        /* Fallback image check */
                        src={pfloorplans}
                        className="w-full h-full object-contain blur-[5px] opacity-40 group-hover:blur-[12px] transition-all duration-700 scale-110"
                        alt={layout.title}
                        onError={(e) => { e.target.src = '../assets/images/pfloorplans.jpg'; }}
                      />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div onClick={() => openContactForm("View Floor Plan", "brochure_download")} className="bg-white/80 backdrop-blur-md px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-white flex items-center gap-2 text-black font-bold text-[10px] sm:text-xs tracking-widest shadow-xl group-hover:scale-110 transition-transform cursor-pointer CadillacGothic-Regular uppercase">
                          <Eye size={14} /> View Plan
                        </div>
                      </div>
                    </div>

                    {/* INFO */}
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[#28659b] text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase mb-1 CadillacGothic-Regular">
                          {/* Matches 'title' in your API (e.g., "3.5 BHK") */}
                          {layout.title}
                        </p>
                        <h4 className="text-xl sm:text-2xl font-serif text-black CadillacGothic-Regular">
                          {/* Matches 'description' in your API (e.g., "2450 Sq.Ft.") */}
                          {layout.description || "Area on Request"}
                        </h4>
                      </div>

                      <div onClick={() => openContactForm("Download Floor Plan", "brochure_download")} className="p-3 bg-[#dbdad6] rounded-full text-black group-hover:bg-[#28659b] group-hover:text-white transition-all duration-500 cursor-pointer">
                        <Download size={18} />
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
          </Swiper>

          {/* NAVIGATION */}
          <div className="flex gap-3 sm:gap-4 mt-10 sm:mt-12 justify-center lg:justify-start">
            <button className="layout-prev w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-200 flex items-center justify-center bg-white text-black hover:bg-[#28659b] hover:text-white transition-all duration-500 cursor-pointer shadow-sm">
              <ChevronLeft size={22} />
            </button>
            <button className="layout-next w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-200 flex items-center justify-center bg-white text-black hover:bg-[#28659b] hover:text-white transition-all duration-500 cursor-pointer shadow-sm">
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>
      </section>


      {/* SECTION: GALLERY */}
      {((galleryData.images && galleryData.images.length > 0) || (galleryData.videos && galleryData.videos.length > 0)) && (
        <section className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden">
          <div className="max-w-[1450px] mx-auto px-4 sm:px-6">
            
            {/* HEADER */}
            <div className="text-center mb-10 md:mb-16">
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold mb-3 md:mb-4 text-[#40a6ff] CadillacGothic-Regular">
                Visual Experience
              </motion.p>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} 
                className="xs:text-[22px] text-[28px] md:text-[34px] lg:text-[36px] xl:text-[48px] font-serif PlayfairDisplay text-black tracking-tight"
              >
                Sapphire Residences Gallery
              </motion.h2>
            </div>

            {/* TABS - Only visible if BOTH Images and Videos exist */}
            {galleryData.images?.length > 0 && galleryData.videos?.length > 0 && (
              <div className="flex justify-center mb-10 md:mb-16">
                <div className="inline-flex bg-gray-100 p-1 md:p-1.5 rounded-full relative w-full sm:w-auto">
                  {['IMAGES', 'VIDEOS'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => { setGalleryTab(tab); setGalleryVisibleCount(3); }}
                      className={`relative z-10 flex-1 sm:flex-none px-6 md:px-10 py-2.5 md:py-3 text-[12px] md:text-[14px] font-bold uppercase tracking-[0.2em] transition-colors duration-500 flex items-center justify-center gap-2 CadillacGothic-Regular ${galleryTab === tab ? 'text-white' : 'text-gray-500 hover:text-black'}`}
                    >
                      {tab === 'IMAGES' ? <ImageIcon size={16} className="md:w-[18px]" /> : <VideoIcon size={16} className="md:w-[18px]" />}
                      <span>{tab}</span>
                      {galleryTab === tab && (
                        <motion.div layoutId="activeGalTab" className="absolute inset-0 bg-[#28659b] rounded-full -z-10 shadow-lg" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CONTENT */}
            <AnimatePresence mode="wait">
              {(galleryTab === 'IMAGES' && galleryData.images?.length > 0) || (galleryData.videos?.length === 0) ? (
                <motion.div key="img-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {(galleryData.images || []).slice(0, galleryVisibleCount).map((img, i) => (
                      <motion.div 
                        key={i} layout 
                        onClick={() => setGallerySelectedItem({ type: 'image', src: img })}
                        className="group relative aspect-square rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-gray-50 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
                      >
                        <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm">
                          <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 border border-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white"><Maximize2 size={20} /></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {galleryVisibleCount < (galleryData.images?.length || 0) && (
                    <div className="flex justify-center mt-10 md:mt-12">
                      <button onClick={() => setGalleryVisibleCount(prev => prev + 3)} className="group relative overflow-hidden px-8 md:px-14 py-4 md:py-5 bg-[#28659b] text-white text-[14px] md:text-[16px] font-bold uppercase tracking-wide rounded-full CadillacGothic-Regular transition-all active:scale-95">
                        <span className="relative z-10 flex items-center gap-3">Load More Images <Plus size={20} /></span>
                        <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                galleryData.videos?.length > 0 && (
                  <motion.div key="vid-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {galleryData.videos.map((vid, i) => (
                      <div key={i} onClick={() => setGallerySelectedItem({ type: 'video', src: vid.url })} 
                        className="group relative aspect-video rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-black shadow-2xl cursor-pointer"
                      >
                        <img 
                          src={vid.thumb} 
                          alt={vid.title} 
                          className="w-full h-full object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90" 
                          onError={(e) => { e.target.src = galleryData.images?.[0]; }} 
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 md:w-20 md:h-20 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white group-hover:bg-[#40a6ff] group-hover:scale-110 transition-all duration-500 shadow-2xl">
                            <Play fill="currentColor" size={24} className="md:w-[28px] ml-1" />
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 pr-4">
                          <h4 className="text-white text-[20px] md:text-[28px] lg:text-[34px] font-bold PlayfairDisplay tracking-tight leading-tight">
                            {vid.title}
                          </h4>
                          <p className="text-white/60 text-xs md:text-sm uppercase tracking-widest mt-2 flex items-center gap-2">
                            <Play size={12} /> Watch Preview
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )
              )}
            </AnimatePresence>

            {/* LIGHTBOX OVERLAY */}
            <AnimatePresence>
              {gallerySelectedItem && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
                  onClick={() => setGallerySelectedItem(null)}
                >
                  <button className="absolute top-5 right-5 md:top-10 md:right-10 text-white/50 hover:text-white transition-colors">
                    <X size={32} className="md:w-[40px]" />
                  </button>
                  
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="max-w-5xl w-full max-h-[85vh] flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {gallerySelectedItem.type === 'image' ? (
                      <img src={gallerySelectedItem.src} className="max-w-full max-h-[80vh] object-contain rounded-lg md:rounded-xl shadow-2xl" alt="Preview" />
                    ) : (
                      <div className="w-full aspect-video rounded-xl md:rounded-3xl overflow-hidden shadow-2xl bg-black">
                        <iframe src={gallerySelectedItem.src} className="w-full h-full" allow="autoplay; fullscreen" allowFullScreen title="Video Player" />
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      )}

  
      {/* SECTION: FAQ & INQUIRY */} 
      <section className="py-16 sm:py-20 md:py-28 bg-[#f1f8ff] overflow-hidden border-t border-gray-100">
        <div className="max-w-[1450px] mx-auto px-5 sm:px-6">
          
          {/* HEADER */}
          <div className="text-center mb-16 md:mb-24">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold mb-4 text-[#40a6ff] CadillacGothic-Regular"
            >
              Concierge Support
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="
                font-serif PlayfairDisplay tracking-tight text-black
                xs:text-[22px] text-[28px] md:text-[34px] lg:text-[38px] xl:text-[48px]
              "
            >
              Queries & Inquiry
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* LEFT: FAQ ACCORDION */}
            <div className="space-y-1 CadillacGothic-Regular">
              {faqData && faqData.length > 0 ? (
                faqData.map((faq, index) => (
                  <div key={index} className="group border-b border-gray-100">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                      className="w-full flex items-center justify-between py-5 sm:py-6 text-left"
                    >
                      <span
                        className={`text-base sm:text-lg font-medium tracking-tight transition-colors duration-300 ${
                          openFaq === index
                            ? 'text-[#28659b]'
                            : 'text-black/80 group-hover:text-black'
                        }`}
                      >
                        {faq.q}
                      </span>

                      <div
                        className={`transition-transform duration-500 ${
                          openFaq === index
                            ? 'rotate-180 text-[#28659b]'
                            : 'text-black/80'
                        }`}
                      >
                        {openFaq === index ? <Minus size={20} /> : <Plus size={20} />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="pb-5 sm:pb-6 text-gray-800 text-sm leading-relaxed max-w-xl">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 py-10">Loading FAQs...</p>
              )}
            </div>

            {/* RIGHT: INQUIRY FORM */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="
                bg-[#28659b]
                p-8 sm:p-10 md:p-12
                rounded-[6px]
                shadow-2xl
                relative
                ml-0 lg:ml-40
              "
            >
              <h3 className="text-2xl sm:text-[34px] tracking-tight font-bold text-white mb-4 PlayfairDisplay">
                Personalized Inquiry
              </h3>

              <form className="space-y-2">
                {[
                  { id: 'f_name', label: 'Full Name', type: 'text' },
                  { id: 'f_email', label: 'Email Address', type: 'email' },
                  { id: 'f_phone', label: 'Phone Number', type: 'tel' }
                ].map((field) => (
                  <div key={field.id} className="relative group">
                    <input
                      type={field.type}
                      id={field.id}
                      placeholder=" "
                      className="
                        peer w-full bg-transparent text-white px-0 py-4
                        border-b border-white/50 outline-none
                        transition-all duration-300
                        focus:border-white hover:border-white
                      "
                    />
                    <label
                      htmlFor={field.id}
                      className="
                        absolute left-0 top-4 text-white text-sm
                        transition-all duration-300 pointer-events-none
                        peer-focus:-translate-y-4 peer-focus:text-[10px]
                        peer-[:not(:placeholder-shown)]:-translate-y-4
                        peer-[:not(:placeholder-shown)]:text-[10px]
                        uppercase tracking-wider CadillacGothic-Regular
                      "
                    >
                      {field.label}
                    </label>
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-500 peer-focus:w-full"></div>
                  </div>
                ))}

                <div className="relative group pt-2">
                  <textarea
                    id="f_message"
                    rows="2"
                    placeholder=" "
                    className="
                      peer w-full bg-transparent text-white px-0 py-4
                      border-b border-white/50 outline-none
                      transition-all duration-300
                      focus:border-white hover:border-white
                      resize-none
                    "
                  />
                  <label
                    htmlFor="f_message"
                    className="
                      absolute left-0 top-4 text-white text-sm
                      transition-all duration-300 pointer-events-none
                      peer-focus:-translate-y-4 peer-focus:text-[10px]
                      peer-[:not(:placeholder-shown)]:-translate-y-4
                      peer-[:not(:placeholder-shown)]:text-[10px]
                      uppercase tracking-wider CadillacGothic-Regular
                    "
                  >
                    Your Message
                  </label>
                </div>

                <button className="w-full mt-8 group relative overflow-hidden bg-white py-4 rounded-[4px] transition-all duration-500 hover:shadow-[0_10px_20px_rgba(64,166,255,0.2)]">
                  <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center justify-center gap-3 text-black group-hover:text-white font-bold uppercase tracking-wide text-sm sm:text-[16px] CadillacGothic-Regular">
                    Send Inquiry <Send size={18} />
                  </span>
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

     {/* SECTION 3: CONTACT CTA */}
      {/* <ContactCTA />           */}
      
      {/* LIGHTBOXES & CTA */}
      <AnimatePresence>
        {videoOpen && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
            <button 
              onClick={() => setVideoOpen(false)}
              className="absolute top-5 right-5 text-white/50 hover:text-white"
            >
              <X size={40} />
            </button>
            
            <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
              <iframe 
                src={immersiveUrl} 
                className="w-full h-full" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen 
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
  {lightboxOpen && (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
    >
      {/* Close Button */}
      <button 
        onClick={() => setLightboxOpen(false)} 
        className="absolute top-8 right-8 text-white/70 hover:text-white z-[1100] cursor-pointer"
      >
        <X size={48} strokeWidth={1} />
      </button>

      <div className="w-full h-full max-w-6xl relative flex items-center justify-center">
        <Swiper 
          modules={[Navigation]} 
          initialSlide={activePhoto} 
          navigation={{ nextEl: '.lb-next', prevEl: '.lb-prev' }} 
          className="w-full h-full"
        >
          {/* FIX: Changed highlights to highlightsData */}
          {(highlightsData || []).map((item, idx) => (
            <SwiperSlide key={idx} className="flex items-center justify-center">
              <div className="flex flex-col items-center justify-center w-full h-full text-center">
                <img 
                  src={item.image} 
                  className="max-w-full max-h-[70vh] object-contain shadow-2xl rounded-lg border border-white/5" 
                  alt={item.title || "Highlight View"} 
                  // Handles broken images in lightbox
                  onError={(e) => { e.target.src = "https://via.placeholder.com/1200x800?text=Image+Not+Available"; }}
                />
                
                <div className="mt-8 text-white px-4">
                  <h4 className="text-2xl md:text-3xl font-serif mb-2 tracking-wide PlayfairDisplay">
                    {item.title}
                  </h4>
                  <p className="text-white/60 text-sm md:text-base max-w-lg mx-auto font-light CadillacGothic-Regular">
                    {/* Changed item.desc to item.description to match your backend state */}
                    {item.description || item.desc}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Arrows */}
        <button className="lb-prev absolute left-0 md:-left-20 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all z-[1020] cursor-pointer">
          <ChevronLeft size={64} strokeWidth={1} />
        </button>
        <button className="lb-next absolute right-0 md:-right-20 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all z-[1020] cursor-pointer">
          <ChevronRight size={64} strokeWidth={1} />
        </button>
      </div>
    </motion.div>
  )}
      </AnimatePresence>
 
      {/* popup */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Popup Container */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-black/10 rounded-full transition-colors md:text-black"
              >
                <X size={24} />
              </button>

              {/* LEFT COLUMN: Image */}
              <div className="hidden md:block md:w-1/2 relative">
                <img 
                  src={sapphirefeatured} // Use your project featured image here
                  alt="Project View" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/40 to-transparent" />
                <div className="absolute bottom-10 left-10 text-white">
                  <h4 className="text-2xl font-serif PlayfairDisplay">Sapphire Residences</h4>
                   
                </div>
              </div>

              {/* RIGHT COLUMN: Form */}
              <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white">
                <div className="mb-8">
                  <p className="text-[#40a6ff] text-[10px] uppercase tracking-[0.3em] font-bold mb-2 CadillacGothic-Regular">Get in Touch</p>
                  <h3 className="text-2xl sm:text-3xl font-serif PlayfairDisplay text-black leading-tight">
                    {formContext.title}
                  </h3>
                </div>

                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); /* Add submission logic here */ }}>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-gray-800 font-bold CadillacGothic-Regular">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#28659b] transition-colors text-black" required />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-gray-800 font-bold CadillacGothic-Regular">Phone Number</label>
                    <input type="tel" placeholder="+91 00000 00000" className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#28659b] transition-colors text-black" required />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-gray-800 font-bold CadillacGothic-Regular">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#28659b] transition-colors text-black" required />
                  </div>

                  {/* Hidden field to identify request type in backend */}
                  <input type="hidden" value={formContext.type} />

                  <button className="w-full mt-8 group relative overflow-hidden bg-[#28659b] py-4 rounded-md transition-all">
                    <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center justify-center gap-3 text-white font-bold uppercase tracking-widest text-sm CadillacGothic-Regular">
                      Submit Request <Send size={16} />
                    </span>
                  </button>
                </form>
                
                <p className="mt-6 text-[10px] text-gray-700 text-center leading-relaxed">
                  By submitting, you agree to our privacy policy and terms of service.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STICKY CTA BAR */}
      <motion.div 
              initial={{ y: 100 }} 
              animate={{ y: 0 }} 
              className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-[95%] md:w-auto"
            >
              <div className="bg-white/80 backdrop-blur-2xl border border-white/20 px-1 pl-4 md:px-2 py-1 md:py-2 md:pl-8 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center gap-4 sm:gap-10 md:gap-16 justify-between">
                
                {/* Text Section - Now visible on all screens */}
                <div className="flex flex-col justify-center">
                  <p className="text-[8px] md:text-[9px] font-bold tracking-[0.8px] uppercase text-[#000000] mb-1 md:mb-2 leading-none NeueHaasDisplay-Roman">
                    Investment Inquiry
                  </p>
                  <p className="text-[12px] md:text-sm font-serif text-black leading-none font-bold Ameyasans-WideMedium">
                    Sapphire Residences
                  </p>
                </div>
      
                {/* Button */}
                <button onClick={() => openContactForm("Enquire Now", "brochure_download")} className="bg-[#28659b] text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-[11px] md:text-[13px] font-bold uppercase tracking-[1px] md:tracking-widerder hover:bg-[#28659b] transition-all duration-300 shadow-xl shadow-black/10 CadillacGothic-Regular whitespace-nowrap cursor-pointer">
                  Enquire Now
                </button>
              </div>
      </motion.div>

    </div>
  );
};

export default Resipage;