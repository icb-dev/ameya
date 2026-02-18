import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, Scrollbar } from 'swiper/modules';
import { 
  Plus, Minus, MapPin, Building2, ChevronLeft, ChevronRight, 
  ArrowUpRight, Download, Phone, Layout, ShieldCheck, Waves, X,
  Calendar, Maximize2, CheckCircle2, Play, Map as MapIcon, Clock, Eye, Send
} from 'lucide-react'; 
// --- Assets ---
import residencelogo from '../assets/images/residencelogo1.png'; 
import sapphirefeatured from '../assets/images/residentialfimg.png';  
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

// --- Data ---
const highlights = [
  { id: 1, title: "Two Towers G+18 Floors Spread Over 2.5 Acre", desc: "Two Elegant High-Rise Towers Rising G+18 Floors Amidst A Thoughtfully Planned 2.5-Acre Development.", image: SR1 },
  { id: 2, title: "Select 116 Residences", desc: "An Exclusive Collection Of Only 116 Residences Ensuring Privacy And Low-Density Living.", image: SR3 },
  { id: 3, title: "Gated Complex With Modern Amenities", desc: "A Secure Gated Community Featuring Contemporary Lifestyle Amenities For Everyday Comfort.", image: SR2 },
  { id: 4, title: "24x7 Multi-Tier Security", desc: "Round-The-Clock Multi-Layered Security Systems Ensuring Complete Safety And Peace Of Mind.", image: SR11 },
  { id: 5, title: "3-Level G+2 Parking", desc: "Well-Planned Three-Level G+2 Parking Designed For Hassle-Free Vehicle Management.", image: SR10 },
  { id: 6, title: "Double Height Arrival Lobby", desc: "A Grand Double-Height Entrance Lobby That Creates A Striking First Impression.", image: SR7 },
  { id: 7, title: "Luxury 3.5 BHK Apartments", desc: "Spacious And Luxuriously Crafted 3.5 BHK Homes Designed For Elevated Urban Living.", image: SR8 },
  { id: 8, title: "Dedicated Common Room For Domestic Helps", desc: "A Thoughtfully Designed Common Room Dedicated To Domestic Staff For Added Convenience.", image: SR9 },
  { id: 9, title: "Premier Clubhouse Of Over 25,000 Sq. Ft.", desc: "An Expansive Premier Clubhouse Spanning Over 25,000 Sq. Ft. For Leisure And Social Living.", image: SR6 },
  { id: 10, title: "State-Of-The-Art Gymnasium", desc: "A Fully Equipped Modern Gymnasium Designed For An Active And Healthy Lifestyle.", image: SR4 },
  { id: 11, title: "Infinity Edge Swimming Pool", desc: "A Stunning Infinity Edge Pool Offering A Resort-Like Experience Within The Community.", image: SR12 }
];

const premierOfferings = {
  Active: [
    { title: "Multiple Pools", img: SR12 },
    { title: "Golf Chip & Putt Space", img: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2070" },
    { title: "Cricket Pitch", img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2070" },
    { title: "Tennis Court", img: SR13 }
  ],
  Community: [
    { title: "Grand Clubhouse", img: SR6 },
    { title: "Zen Garden", img: SR14 },
    { title: "Banquet Hall", img: SR20 },
    { title: "Business Centre", img: SR19 }
  ],
  Recreational: [
    { title: "Private Theatre", img: SR18 },
    { title: "Indoor Games Room", img: SR17 },
    { title: "Kids Play Area", img: SR16 },
    { title: "Yoga Centre", img: SR15 }
  ]
};

const locationAdvantages = [
  { place: "Google Campus", time: "Within 5 Minutes" },
  { place: "Air India Campus", time: "Within 5–10 Minutes" },
  { place: "DLF CyberHub", time: "Within 10–20 Minutes" },
  { place: "Maruti Udyog", time: "Within 10–20 Minutes" }, 
  { place: "Sunrise Public School", time: "Within 5 Minutes" },
  { place: "DAV Public School", time: "Within 5–10 Minutes" },
  { place: "32nd Avenue", time: "Within 10–20 Minutes" },
  { place: "MGF Metropolitan Mall", time: "Within 10–20 Minutes" }
];

const unitLayouts = {
  "3.5 BHK": [
    { id: 1, type: "Type A", area: "2450 Sq.Ft.", img: pfloorplans },
    { id: 2, type: "Type B", area: "2550 Sq.Ft.", img: pfloorplans },
    { id: 3, type: "Type C", area: "2600 Sq.Ft.", img: pfloorplans },
    { id: 4, type: "Type D", area: "2600 Sq.Ft.", img: pfloorplans }
  ],
  "4.5 BHK": [
    { id: 1, type: "Luxury A", area: "3200 Sq.Ft.", img: pfloorplans },
    { id: 2, type: "Luxury B", area: "3450 Sq.Ft.", img: pfloorplans },
    { id: 3, type: "Luxury C", area: "3600 Sq.Ft.", img: pfloorplans },
    { id: 4, type: "Type D", area: "2600 Sq.Ft.", img: pfloorplans }
  ],
  "5 BHK": [
    { id: 1, type: "Presidential", area: "4500 Sq.Ft.", img: pfloorplans },
    { id: 2, type: "Royal Suite", area: "4800 Sq.Ft.", img: pfloorplans },
    { id: 3, type: "Imperial", area: "5200 Sq.Ft.", img: pfloorplans },
    { id: 4, type: "Type D", area: "2600 Sq.Ft.", img: pfloorplans }
  ]
};

const defaultData = {  
  faqs: [
    { question: "What is the construction status?", answer: "The project is currently in advanced stages of construction with structure completion achieved." },
    { question: "What is the investment potential?", answer: "Located in Sector 92, this project serves over 15,000+ families in the immediate vicinity, ensuring high footfall." }
  ]
};

const Residentialproject = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('VR');
  const [offeringTab, setOfferingTab] = useState('Active');
  const [layoutTab, setLayoutTab] = useState('4.5 BHK');
  const [activePhoto, setActivePhoto] = useState(0);
  const heroRef = useRef(null);
   //faq state
  const [openFaq, setOpenFaq] = useState(0);

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bannerY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-blue-100">
      
       
      {/* SECTION 1: HERO */}
      <section
        ref={heroRef}
        className="relative w-full h-[100vh] sm:h-[90vh] md:h-screen flex items-end justify-center overflow-hidden"
      >
        <motion.div style={{ y: bannerY }} className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.3 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            src={sapphirefeatured}
            className="w-full h-[120%] object-cover"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
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
            <span
              className="
                text-white font-medium opacity-90 CadillacGothic-Regular block
                text-[10px] sm:text-[12px] md:text-[20px]
                tracking-[0.3em] uppercase
                mb-4 md:mb-8
              "
            >
              AMEYA GROUP
            </span>

            <div className="w-full flex justify-center">
              <img
                src={residencelogo}
                className="
                  w-[200px] xs:w-[220px] sm:w-[260px]
                  md:w-[400px] lg:w-[300px] xl:w-[350px]
                  h-auto object-contain
                "
                alt="Logo"
              />
            </div>
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
                Sapphire Residences
              </h2>

              <p className="flex items-center gap-2 text-[#28659b] font-bold text-xs sm:text-sm tracking-wide CadillacGothic-Regular mb-6 md:mb-8">
                <MapPin size={18} /> Sector 15, Part 2, Gurugram, Haryana
              </p>

              <p
                className="
                  text-black CadillacGothic-Regular font-light
                  text-[13px] sm:text-[14px]
                  leading-[1.6] md:leading-[1.4]
                  mb-8 md:mb-10
                "
              >
                Ameya Sapphire Residences, developed by the reputed Ameya Group, is an exclusive luxury residential address located in the heart of Sector 15, Gurgaon (NH-8 corridor). Designed as a premium gated community, this upscale project sprawls across approximately 2.5 acres and comprises stylishly crafted apartments that resonate with modern living and sophistication. Set amidst one of Gurgaon’s most strategic and well-connected locations, Sapphire Residences offers residents a perfect blend of comfort, convenience, and contemporary elegance. The development features two slender towers rising gracefully over the skyline, housing a select number of beautifully appointed homes.
              </p>

              {/* FEATURES GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-8 gap-y-8 md:gap-y-10 mb-10 md:mb-12">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-[#28659b]">
                    <Building2 size={22} />
                  </div>
                  <p className="CadillacGothic-Regular text-sm font-semibold text-black leading-snug">
                    Ultra-Premium Luxury Apartments & Penthouses
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-[#28659b]">
                    <Waves size={22} />
                  </div>
                  <p className="CadillacGothic-Regular text-sm font-semibold text-black leading-snug">
                    Exclusive Club House with Modern Amenities
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-[#28659b]">
                    <Layout size={22} />
                  </div>
                  <p className="CadillacGothic-Regular text-sm font-semibold text-black leading-snug">
                    Thoughtfully Planned Spacious Interiors
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-[#28659b]">
                    <ShieldCheck size={22} />
                  </div>
                  <p className="CadillacGothic-Regular text-sm font-semibold text-black leading-snug">
                    Gated Community with 3-Tier Security
                  </p>
                </div>
              </div>

              {/* CTA BUTTONS */}
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <button className="flex items-center gap-3 bg-[#28659b] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold uppercase text-[12px] sm:text-[14px] tracking-widest hover:bg-black transition-all CadillacGothic-Regular">
                  Enquire Now <ArrowUpRight size={18} />
                </button>

                <button className="flex items-center gap-3 border-2 border-[#28659b] text-[#28659b] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold uppercase text-[12px] sm:text-[14px] tracking-widest hover:bg-[#28659b] hover:text-white transition-all CadillacGothic-Regular">
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
                  <img src={fr} className="w-full h-full object-cover" alt="Slide 1" />
                </SwiperSlide>

                <SwiperSlide>
                  <img src={sapphirefeatured} className="w-full h-full object-cover" alt="Slide 2" />
                </SwiperSlide>

                {/* ✅ Pagination – SAME AS ORIGINAL */}
                <div className="custom-overview-pagination absolute !bottom-6 !right-6 !left-auto !w-auto z-30 flex gap-2"></div>
              </Swiper>
            </motion.div>

          </div>
        </div>

        {/* PAGINATION STYLES (UNCHANGED) */}
        <style
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
        />
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
              {highlights.map((item, idx) => (
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
                        {item.desc}
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

            {/* TAB OUTER (FIXED PILL) */}
            <div className="bg-[#dbdad6] rounded-full p-1.5 w-full lg:w-auto">
              
              {/* TAB INNER (SCROLLABLE STRIP) */}
              <div
                className="
                  flex gap-2
                  overflow-x-auto
                  whitespace-nowrap
                  px-3
                  lg:px-0
                "
              >
                {[
                  { label: 'Virtual Reality', id: 'VR' },
                  { label: 'Construction Update', id: 'CU' },
                  { label: 'Construction Milestone', id: 'CM' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-shrink-0
                      px-4 sm:px-6 py-2 sm:py-2.5
                      rounded-full
                      text-[13px] sm:text-[16px]
                      font-bold transition-all duration-300 CadillacGothic-Regular
                      ${activeTab === tab.id
                        ? 'bg-[#28659b] text-white shadow-lg'
                        : 'text-black hover:text-slate-900'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* VIDEO / IMAGE */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden group shadow-2xl bg-slate-100">
            <AnimatePresence mode="wait">
              {activeTab !== 'CM' ? (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <img
                    src={activeTab === 'VR' ? SR1 : SR3}
                    className="w-full h-full object-cover"
                    alt="View"
                  />

                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <button
                      onClick={() => setVideoOpen(true)}
                      className="
                        bg-black/40 backdrop-blur-md rounded-full
                        flex items-center justify-center
                        border border-white text-white
                        transition-transform duration-500 hover:scale-110
                        w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32
                      "
                    >
                      <Play fill="white" size={40} className="md:w-12 md:h-12" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="cm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <img
                    src={SR12}
                    className="w-full h-full object-cover"
                    alt="Milestone"
                  />
                </motion.div>
              )}
            </AnimatePresence>
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

            {/* TAB OUTER (FIXED PILL – SAME AS IMMERSIVE TOUR) */}
            <div className="bg-[#dbdad6] rounded-full p-1.5 w-full lg:w-auto">
              
              {/* TAB INNER (SCROLLABLE OPTIONS ONLY) */}
              <div
                className="
                  flex gap-2
                  overflow-x-auto
                  whitespace-nowrap
                  px-3
                  lg:px-0
                "
              >
                {[
                  { label: 'Active Lifestyle', id: 'Active' },
                  { label: 'Community Spaces', id: 'Community' },
                  { label: 'Recreational Zone', id: 'Recreational' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setOfferingTab(tab.id)}
                    className={`
                      flex-shrink-0
                      px-4 sm:px-6 py-2 sm:py-2.5
                      rounded-full
                      text-[13px] sm:text-[16px]
                      font-bold transition-all duration-300 CadillacGothic-Regular
                      ${offeringTab === tab.id
                        ? 'bg-[#28659b] text-white shadow-lg'
                        : 'text-black hover:text-slate-900'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SLIDER */}
          <div className="relative w-full group overflow-visible">
            <Swiper
              key={`swiper-${offeringTab}`}
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              slidesPerView={1.1}
              breakpoints={{
                768: { slidesPerView: 3 }
              }}
              navigation={{
                nextEl: '.offering-next',
                prevEl: '.offering-prev'
              }}
              className="overflow-visible"
            >
              {premierOfferings[offeringTab].map((item, idx) => (
                <SwiperSlide key={`${offeringTab}-${idx}`} className="h-full">
                  <div className="relative aspect-[1/1] rounded-xl overflow-hidden group/item cursor-pointer shadow-lg">
                    <img
                      src={item.img}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                      alt={item.title}
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
            <div className="flex gap-3 sm:gap-4 mt-8 md:mt-10">
              <button className="offering-prev w-12 h-12 rounded-full border border-black-500 flex items-center justify-center bg-white hover:bg-[#28659b] hover:text-white transition-all shadow-sm z-30 cursor-pointer">
                <ChevronLeft size={20} />
              </button>
              <button className="offering-next w-12 h-12 rounded-full border border-black-500 flex items-center justify-center bg-white hover:bg-[#28659b] hover:text-white transition-all shadow-sm z-30 cursor-pointer">
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
            <h2
              className="
                font-serif PlayfairDisplay tracking-tight text-black
                xs:text-[22px] text-[28px] md:text-[34px] lg:text-[38px] xl:text-[48px]
              "
            >
              Connectivity
            </h2>
          </div>

          {/* MAP */}
          <div
            className="
              w-full
              h-[300px] sm:h-[400px] md:h-[600px]
              rounded-3xl overflow-hidden shadow-xl mb-10 md:mb-12
              border border-slate-100 bg-slate-50
            "
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.502840858685!2d77.03866857528257!3d28.46439957575701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19fabac453f3%3A0xe4a0b2ea56b4e62!2sSapphire%20Residences!5e0!3m2!1sen!2sin!4v1768390793981!5m2!1sen!2sin"
              className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
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
              {locationAdvantages.map((item, idx) => (
                <SwiperSlide key={idx}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="
                      flex flex-col gap-3 p-5 sm:p-6
                      rounded-2xl bg-[#dbdad6] border border-slate-100
                      transition-all duration-300
                      hover:bg-white hover:shadow-lg
                      h-full mb-4
                    "
                  >
                    <div>
                      <h4 className="font-bold text-black text-sm sm:text-base leading-tight mb-1 CadillacGothic-Regular">
                        {item.place}
                      </h4>
                      <p className="text-[#28659b] text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                        {item.time}
                      </p>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* SCROLLBAR */}
            <div className="w-full px-1">
              <div className="custom-scrollbar h-1 bg-slate-100 rounded-full relative"></div>
            </div>
          </div>
        </div>

        {/* SCROLLBAR STYLES (UNCHANGED) */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
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
            `
          }}
        />
      </section> 
      
      {/* SECTION 7: UNIT LAYOUTS */} 
      <section className="py-16 sm:py-20 md:py-24 bg-white flex flex-col items-center overflow-hidden">
  <div className="max-w-[1450px] w-full px-5 sm:px-6">
    
    {/* HEADER */}
    <div
      className="
        flex flex-col items-center text-center
        lg:flex-row lg:items-center lg:justify-between lg:text-left
        mb-12 md:mb-16 gap-4 sm:gap-6
      "
    >
      
      {/* TITLE */}
      <h2
        className="
          font-serif PlayfairDisplay tracking-tight text-black
          xs:text-[22px] text-[28px] md:text-[34px] lg:text-[38px] xl:text-[48px]
        "
      >
        Unit Layouts
      </h2>

      {/* TAB OUTER */}
      <div className="bg-[#dbdad6] rounded-full p-1.5 w-full lg:w-auto">
        
        {/* TAB INNER – NO SCROLL */}
        <div
          className="
            flex gap-2
            flex-wrap
            justify-center lg:justify-start
            px-3 lg:px-0
          "
        >
          {Object.keys(unitLayouts).map((tab) => (
            <button
              key={tab}
              onClick={() => setLayoutTab(tab)}
              className={`
                px-5 sm:px-8 py-2.5
                rounded-full
                text-[14px] sm:text-[16px]
                font-bold transition-all duration-500 CadillacGothic-Regular
                ${layoutTab === tab
                  ? 'bg-[#28659b] text-white shadow-lg scale-105'
                  : 'text-black hover:text-slate-900'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* SLIDER */}
    <div className="relative w-full">
      <Swiper
        key={layoutTab}
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
        {unitLayouts[layoutTab].map((layout, idx) => (
          <SwiperSlide key={idx}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="
                group relative bg-white rounded-3xl
                p-6 sm:p-8
                border border-slate-100
                hover:border-blue-100
                transition-all duration-500
                hover:shadow-2xl
                overflow-hidden
              "
            >
              {/* IMAGE */}
              <div className="relative aspect-[4/3] mb-6 sm:mb-8 overflow-hidden rounded-2xl bg-slate-50 flex items-center justify-center p-4">
                <img
                  src={layout.img}
                  className="
                    w-full h-full object-contain
                    blur-[5px] opacity-40
                    group-hover:blur-[12px]
                    transition-all duration-700
                    scale-110
                  "
                  alt="Floor Plan"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/80 backdrop-blur-md px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-white flex items-center gap-2 text-black font-bold text-[10px] sm:text-xs tracking-widest shadow-xl group-hover:scale-110 transition-transform cursor-pointer CadillacGothic-Regular">
                    <Eye size={14} /> VIEW PLAN
                  </div>
                </div>
              </div>

              {/* INFO */}
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[#28659b] text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase mb-1 CadillacGothic-Regular">
                    {layout.type}
                  </p>
                  <h4 className="text-xl sm:text-2xl font-serif text-black CadillacGothic-Regular">
                    {layout.area}
                  </h4>
                </div>

                <div className="p-3 bg-[#dbdad6] rounded-full text-black group-hover:bg-[#28659b] group-hover:text-white transition-all duration-500">
                  <Download size={18} />
                </div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* NAVIGATION */}
      <div className="flex gap-3 sm:gap-4 mt-10 sm:mt-12 justify-start">
        <button className="layout-prev w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-black-500 flex items-center justify-center bg-white text-black hover:bg-[#28659b] hover:text-white transition-all duration-500 cursor-pointer">
          <ChevronLeft size={22} />
        </button>
        <button className="layout-next w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-black-500 flex items-center justify-center bg-white text-black hover:bg-[#28659b] hover:text-white transition-all duration-500 cursor-pointer">
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  </div>
      </section>

  
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
              {[
                {
                  q: "What is the timeline for project possession?",
                  a: "The project is on track for completion by the scheduled date with rigorous quality checks."
                },
                {
                  q: "Are the payment plans customizable?",
                  a: "We offer tailored structures including CLP and PLP options for investment milestones."
                },
                {
                  q: "Is the development RERA certified?",
                  a: "Yes, the project is fully RERA compliant. All documentation is available at our experience center."
                },
                {
                  q: "What security measures are in place?",
                  a: "The property features 24/7 multi-tier security and biometric access controls."
                },
                {
                  q: "Are there visitor parking facilities?",
                  a: "Spacious multi-level basement parking is dedicated to visitors to ensure zero congestion."
                }
              ].map((faq, index) => (
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
              ))}
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


      
      {/* LIGHTBOXES & CTA */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl">
            <button onClick={() => setVideoOpen(false)} className="absolute top-8 right-8 text-white hover:scale-110 transition-transform"><X size={48} strokeWidth={1.5}/></button>
            <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
              <iframe className="w-full h-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" title="Tour" frameBorder="0" allowFullScreen></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md">
            <button onClick={() => setLightboxOpen(false)} className="absolute top-8 right-8 text-white/70 hover:text-white z-[1100]"><X size={48} strokeWidth={1} /></button>
            <div className="w-full h-full max-w-6xl relative flex items-center justify-center">
              <Swiper modules={[Navigation]} initialSlide={activePhoto} navigation={{ nextEl: '.lb-next', prevEl: '.lb-prev' }} className="w-full h-full">
                {highlights.map((item, idx) => (
                  <SwiperSlide key={idx} className="flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center w-full h-full text-center">
                       <img src={item.image} className="max-width-full max-h-[70vh] object-contain shadow-2xl rounded-lg border border-white/5" alt="Zoomed" />
                      <div className="mt-8 text-white"><h4 className="text-2xl md:text-3xl font-serif mb-2 tracking-wide">{item.title}</h4><p className="text-white/60 text-sm md:text-base max-w-lg mx-auto font-light">{item.desc}</p></div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <button className="lb-prev absolute left-0 md:-left-20 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all z-[1020]"><ChevronLeft size={64} strokeWidth={1} /></button>
              <button className="lb-next absolute right-0 md:-right-20 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all z-[1020]"><ChevronRight size={64} strokeWidth={1} /></button>
            </div>
          </motion.div>
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
                <button className="bg-[#28659b] text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-[11px] md:text-[13px] font-bold uppercase tracking-[1px] md:tracking-widerder hover:bg-[#28659b] transition-all duration-300 shadow-xl shadow-black/10 CadillacGothic-Regular whitespace-nowrap">
                  Enquire Now
                </button>
              </div>
      </motion.div>

    </div>
  );
};

export default Residentialproject;