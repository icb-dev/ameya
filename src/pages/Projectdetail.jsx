import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { 
  Plus, Minus, Maximize2, MapPin, 
  ShieldCheck, TreePine, Train, Building2, ChevronLeft, ChevronRight, Globe,
  Maximize, ArrowUpRight, ShoppingCart, Layout, Send
} from 'lucide-react';
// 1. Add the import at the top 
import ProjectGallery from '../components/ProjectGallery.jsx';
// import Prodhighlights from '../components/Prodhighlights.jsx';
import Prodamenities from '../components/Prodamenities.jsx';
import Prodmix from '../components/Prodmix.jsx';
// import Proddownload from '../components/Proddownload.jsx';
import Projectfloorplan from '../components/Projectfloorplan.jsx';
import ProjectApproach from "../components/ProjectApproach.jsx";
import Newhigh2 from '../components/Newhigh2.jsx';
import Projectlocations from '../components/Projectlocations.jsx'; 
import Projectfaqform from '../components/Projectfaqform.jsx';

import SapphireLogo from '../assets/images/sapphirelogo.png'; 
import sapphirefeatured from '../assets/images/shaphirebnrbg.png';  
import fc from "../assets/images/fc.png";
import { getProjects } from "../../services/projectService";

import '../styles/home2.css';


// --- SWIPER STYLES ---
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/* -------------------------------------------------------------------------- */
/* 1. LOCAL MOCK DATA & HIGHLIGHT DATA                                        */
/* -------------------------------------------------------------------------- */
// const highlightData = [
//   { id: 1, title: "Located in the heart of Sector 57, Gurugram", icon: <Maximize size={32} /> },
//   { id: 2, title: "Modern neighbourhood bazaar concept", icon: <Building2 size={32} /> },
//   { id: 3, title: "Surrounded by well-established residential communities", icon: <Plus size={32} /> },
//   { id: 4, title: "Designed for daily footfall and repeat visits", icon: <ArrowUpRight size={32} /> },
//   { id: 5, title: "Dedicated food haat with multiple cuisine options", icon: <ShoppingCart size={32} /> },
//   { id: 6, title: "Blend of everyday retail and lifestyle outlets", icon: <Layout size={32} /> },
//   { id: 7, title: "Easy-to-navigate, open layout", icon: <Layout size={32} /> },
//   { id: 8, title: "Strong visibility for retail stores", icon: <Layout size={32} /> },
//   { id: 9, title: "Comfortable pedestrian-friendly spaces", icon: <Layout size={32} /> },
//   { id: 10, title: "Casual sit-out zones for social interaction", icon: <Layout size={32} /> },
//   { id: 11, title: "Ideal for cafes, eateries, and local brands", icon: <Layout size={32} /> },
//   { id: 12, title: "Family-friendly environment", icon: <Layout size={32} /> },
// ];

// const defaultData = {
//   title: "Sapphire 57",
//   brand: "Ameya Group",
//   bannerImage: sapphirefeatured,
//   logo: SapphireLogo,
//   highlights: ["RERA Approved", "High-Street Retail", "Zero Debt Project", "Prime Connectivity"],
//   about: {
//     title: "Sector57 is Getting its Own Neighbourhood Bazaar",
//     subtitle: "OVERVIEW",
//     description: "The ease of shopping, the comfort of proximity, seeing and meeting people from your locality, opportunities for impromptu conversations, the joy of a quick bite and the unexpected deals - all in one place. Neighbourhood Bazaars were and will always remain hot destinations for families. Sector 57’s newest neighbourhood bazaar, Sapphire 57, is one such destination where you can go to fulfil all of your heart’s desires. From a vibrant multi-cuisine food haat to premium lifestyle experiences, Sapphire 57 has it all.",
//     image: fc,
//   },
//   categorizedAmenities: {
//     WELLNESS: [
//       { id: 1, name: 'GYMNASIUM', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000' },
//       { id: 2, name: 'CLUB HOUSE', img: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=1000' },
//       { id: 3, name: 'YOGA CENTRE', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000' },
//       { id: 4, name: 'SPA & SAUNA', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000' },
//     ],
//     LEISURE: [
//       { id: 5, name: 'SWIMMING POOL', img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1000' },
//       { id: 6, name: 'MINI THEATRE', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000' },
//     ],
//     BUSINESS: [
//       { id: 7, name: 'CONFERENCE ROOM', img: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=1000' },
//       { id: 8, name: 'CO-WORKING', img: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=1000' },
//     ]
//   },
//   floorPlans: [
//     { title: "Retail Level 0", image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=800" },
//     { title: "Food Court Level 2", image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=800" },
//     { title: "Office Suites", image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=800" },
//     { title: "Retail Level 1", image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=800" },
//   ],
//   location: {
//     mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.6762083237863!2d77.07267787528123!3d28.429025475776424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d199d06977b7b%3A0x35a1366239087b56!2sAmeya%20Sapphire%2057!5e0!3m2!1sen!2sin!4v1767726259715!5m2!1sen!2sin",
//     connectivity: [
//       { point: "NH-8 Expressway", distance: "5 Mins Drive", icon: Building2 },
//       { point: "Proposed Metro", distance: "2 Mins Walk", icon: Train },
//       { point: "Luxury Residencies", distance: "Surrounding Area", icon: MapPin },
//       { point: "Indira Gandhi International Airport", distance: "25 Mins Drive", icon: Globe },
//       { point: "Cyber Hub", distance: "15 Mins Drive", icon: Building2 },
//     ]
//   },
//   faqs: [
//     { question: "What is the construction status?", answer: "The project is currently in advanced stages of construction with structure completion achieved." },
//     { question: "What is the investment potential?", answer: "Located in Sector 92, this project serves over 15,000+ families in the immediate vicinity, ensuring high footfall." }
//   ]
// };

 
 

/* -------------------------------------------------------------------------- */
/* 2. REUSABLE COMPONENTS                                                     */
/* -------------------------------------------------------------------------- */
const SectionHeader = ({ title, subtitle, light = false, center = false, logo = null }) => (
  <div className={`mb-12 ${center ? 'text-center' : 'text-left'}`}>
    {logo && (
      <motion.img 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        src={logo} 
        alt="Logo" 
        className={`h-16 w-auto mb-6 object-contain ${center ? 'mx-auto' : ''}`}
      />
    )}
    <motion.p 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={`text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold mb-4 ${light ? 'text-white/50' : 'text-[#28659b] CadillacGothic-Regular'}`}
    >
      {subtitle}
    </motion.p>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={`xs:text-[22px] text-[28px] md:text-[36px] lg:text-[38px] xl:text-[48px] font-serif leading-tight PlayfairDisplay ${light ? 'text-white' : 'text-black tracking-tight'}`}
    >
      {title}
    </motion.h2>
  </div>
);

/* -------------------------------------------------------------------------- */
/* 3. MAIN COMPONENT                                                          */
/* -------------------------------------------------------------------------- */
const ProjectDetail = ({ data = defaultData }) => {
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeTab, setActiveTab] = useState('WELLNESS');
  const [activePlanTab, setActivePlanTab] = useState('SITEPLAN'); 
  
  const project = data || defaultData;
  const tabs = Object.keys(project.categorizedAmenities);

  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  
  const swiperRow1 = useRef(null);
  const swiperRow2 = useRef(null);
  const amenitySwiper = useRef(null);
  const floorSwiper = useRef(null);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const { scrollYProgress: aboutScroll } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"]
  });
  
  const bannerY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const aboutImageY = useTransform(aboutScroll, [0, 1], ["-10%", "10%"]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const slideBoth = (direction) => {
    if (direction === 'next') {
      swiperRow1.current?.slideNext();
      swiperRow2.current?.slideNext();
    } else {
      swiperRow1.current?.slidePrev();
      swiperRow2.current?.slidePrev();
    }
  };

  // 1. STATE GOES HERE
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <main className="w-full bg-white antialiased overflow-x-hidden selection:bg-amber-100 selection:text-amber-900">
      
      {/* SECTION 1: HERO BANNER */}
      <section ref={heroRef} className="relative w-full h-[90vh] md:h-screen flex items-end justify-center overflow-hidden">
        <motion.div style={{ y: bannerY }} className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.3 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            src={project.bannerImage} 
            className="w-full h-[120%] object-cover" 
            alt="Hero" 
          />
          <div className="absolute inset-0 ar-prodetail-hero-overlay from-black/90 via-black/20 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-[1450px] mx-auto w-full px-6 text-center mb-[40%] md:mb-[14%] flex justify-center items-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ delay: 0.6, duration: 1 }}>
            <span className="text-white text-xs md:text-[22px] tracking-[0.2em] uppercase mb-6 block font-bold CadillacGothic-Regular">
              {project.brand}
            </span>
            {/* <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-0 leading-[0.9] tracking-tighter Ameyasans-WideMedium uppercase">
              {project.title}
            </h1> */}
            <div className="w-full flex justify-center">
              <img src={SapphireLogo} width="400" height="auto" alt="" />   
            </div>  
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: ABOUT THE PROJECT */}
      <section ref={aboutRef} className="py-24 md:py-36 border-b border-gray-100 overflow-hidden">
        <div className="max-w-[1450px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-16 md:gap-24 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 ">
              <SectionHeader 
                logo={project.logo} 
                title={project.about.title} 
                subtitle={project.about.subtitle} 
                className="xs:text-[18px] text-[26px] md:text-[34px] lg:text-[32px] xl:text-[48px]"
              />
              <p className="text-[14px] md:text-[14px] lg:text-[14px] xl:text-[16px] text-[#000] font-light leading-[1.5] CadillacGothic-Regular mb-12 w-[100%] xl:w-[85%]">
                {project.about.description}
              </p>
              <button className="group relative overflow-hidden px-10 py-4 rounded-full bg-[#28659b] text-white text-[14px] font-bold uppercase tracking-wide transition-all">
                <span className="relative z-10 CadillacGothic-Regular">Request Brochure</span>
                <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>

            <div className="lg:col-span-4 order-1 lg:order-2 relative aspect-[4/5] md:h-auto overflow-hidden shadow-3xl">
              <motion.img  
                src={project.about.image} 
                className="absolute inset-0 w-full h-full object-cover" 
                alt="Architecture" 
              />
            </div>
          </div>
        </div>
      </section>


      {/* SECTION 2: PROJECT HIGHLIGHTS */}
      <Newhigh2 />

      {/* SECTION 2: PROJECT HIGHLIGHTS */}
      {/* <Prodhighlights /> */}

      {/* SECTION 3: THE MIX */}
      <Prodmix />

      {/* SECTION 4: AMENITIES */}  
      <Prodamenities />
 
       
       {/* SECTION 5: FLOOR PLANS */} 
       <Projectfloorplan   />

       {/* SECTION 6: HIGH-IMPACT PREMIUM LOCATION ADVANTAGE */}
       <Projectlocations />

       {/* SECTION 7: Gallery */}
       <ProjectGallery /> 

       {/* SECTION 8: FAQ & INQUIRY */}
       <Projectfaqform /> 

       {/* SECTION 9: our APPROACH */}
       <ProjectApproach /> 

      {/* STICKY CTA BAR */}
      <motion.div 
        initial={{ y: 100 }} 
        animate={{ y: 0 }} 
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-[75%] md:w-auto"
      >
        <div className="bg-white/80 backdrop-blur-2xl border border-white/20 px-1 pl-4 md:px-2 py-1 md:py-2 md:pl-8 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center gap-4 sm:gap-10 md:gap-16 justify-between">
          
          {/* Text Section - Now visible on all screens */}
          <div className="flex flex-col justify-center">
            <p className="text-[7px] md:text-[9px] font-bold tracking-[0.8px] uppercase text-[#000000] mb-1 md:mb-2 leading-none NeueHaasDisplay-Roman">
              Investment Inquiry
            </p>
            <p className="text-[12px] md:text-sm font-serif text-black leading-none font-bold Ameyasans-WideMedium truncate max-w-[120px] sm:max-w-none">
              {project.title}
            </p>
          </div>

          {/* Button */}
          <button className="bg-[#28659b] text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-[11px] md:text-[13px] font-bold uppercase tracking-[1px] md:tracking-widerder hover:bg-[#28659b] transition-all duration-300 shadow-xl shadow-black/10 CadillacGothic-Regular whitespace-nowrap">
            Enquire Now
          </button>
        </div>
      </motion.div>
    </main>
  );
};

export default ProjectDetail;