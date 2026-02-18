import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, animate, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination  } from 'swiper/modules';
import { ChevronRight, MapPin, MousePointerClick, LayoutGrid, Footprints, Wallet, Target, Headphones} from 'lucide-react';
// import Aboutcorevalues from "../components/aboutcorevalues";
import Aboutteam from "../components/Aboutteam.jsx";
// import Aboutapproach from "../components/Aboutapproach";
import Aboutcounters from "../components/Aboutcounters.jsx";
import ameyaLogo from '../assets/logo/ameya-logo.png';

import abtbnr1 from "../assets/images/abtbnr1.png";
import abtbnr2 from "../assets/images/abtbnr2.png";
// import bnr3 from "../assets/images/bnr3.jpeg";
import logoreveal1 from "../assets/images/logoreveal1.gif"; 

// import vision from "../assets/images/vision.jpeg";
// import mision from "../assets/images/mision.jpeg";
import Aboutvismis from '../components/Aboutvismis.jsx';
import Abtcorevalues from '../components/Abtcorevalues.jsx';

import ContactCTA from "../components/ContactCTA.jsx";

// --- SWIPER STYLES ---
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/* -------------------------------------------------------------------------- */
/* DATA: LEADERSHIP TEAM                                                      */
/* -------------------------------------------------------------------------- */
const leadershipTeam = [
  {
    name: "Sanjay Gupta",
    role: "Joint Managing Director",
    bio: "A veteran of the real-estate industry, Sanjay Gupta performs the crucial role of leading decision-making and operations at Ameya. His foresight and vision have contributed immensely towards the establishment of major benchmarks.",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000"
  },
  {
    name: "Deepak Gupta",
    role: "Chairman & Managing Director",
    bio: "He has been in the business of real estate for the last 20 years. He played a critical role in finalizing commercial aspects for top real estate companies. He founded Ameya in 2008 with the focus on integrity and quality.",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000"
  },
  {
    name: "Akshat Gupta",
    role: "Director",
    bio: "The new-generation entrepreneur of the family, Akshat Gupta, serves on the group’s management board. With a degree in Business Management from the United States and a Master’s in Civil and Architectural Engineering from the United Kingdom, he brings a strong academic foundation well aligned with the group’s growing real estate ambitions. He remains focused on steering the organisation towards its goals and objectives, while also being actively involved in nurturing new projects from the inception stage itself, with a clear vision to raise the bar for Ameya in the years to come.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000"
  }
];
 
/* -------------------------------------------------------------------------- */
/* COMPONENTS: HELPERS                                                        */
/* -------------------------------------------------------------------------- */
const CounterItem = ({ target, label, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { amount: 0.5 }); 

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, target, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (value) => setCount(Math.floor(value)),
      });
      return () => controls.stop();
    } else {
      setCount(0);
    }
  }, [isInView, target]);

  return (
    <div ref={nodeRef} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[180px] hover:shadow-md transition-shadow">
      <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">{count}{suffix}</div>
      <div className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">{label}</div>
    </div>
  );
};

// New Running Counter Helper for the Land Bank Section
const RunningCounter = ({ target, suffix = "", label, hasBorder = true }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(target);
      if (start === end) return;

      let totalMiliseconds = 2000;
      let timer = setInterval(() => {
        start += Math.ceil(end / 100);
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <div ref={ref} className={`flex flex-col items-center justify-center py-8 px-4 w-full ${hasBorder ? 'lg:border-r border-black/10' : ''}`}>
      <div className="text-[48px] md:text-[72px] font-black text-black leading-none mb-4 CadillacGothic-NarrowRegular">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[13px] md:text-[16px] text-black capitalize  tracking-relaxed text-center CadillacGothic-Regular px-2">
        {label}
      </div>
    </div>
  );
};

const LeaderCard = ({ leader, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.2, ease: [0.215, 0.61, 0.355, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group h-[550px] md:h-[650px] overflow-hidden rounded-[32px] bg-gray-100 shadow-xl shadow-gray-200/50"
    >
      <motion.img
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 1.2 }}
        src={leader.img}
        alt={leader.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 w-full p-10 group-hover:translate-y-full transition-transform duration-500">
        <p className="text-amber-500 text-[10px] uppercase tracking-widest font-bold mb-2">{leader.role}</p>
        <h3 className="text-white text-3xl font-serif">{leader.name}</h3>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 bg-white/95 backdrop-blur-md p-10 flex flex-col justify-center"
      >
        <motion.div animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <span className="inline-block w-12 h-[1px] bg-amber-600 mb-6" />
          <h4 className="text-gray-900 text-3xl font-serif mb-2">{leader.name}</h4>
          <p className="text-amber-600 text-[10px] uppercase tracking-widest font-bold mb-8">{leader.role}</p>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed font-light">{leader.bio}</p>
          <button className="mt-10 flex items-center gap-3 text-gray-900 text-[10px] uppercase font-bold tracking-widest group/btn hover:text-amber-600 transition-colors">
            Profile Details 
            <span className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover/btn:bg-black group-hover/btn:text-white transition-all">
              <ChevronRight size={16} />
            </span>
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN ABOUT PAGE COMPONENT                                                  */
/* -------------------------------------------------------------------------- */
const About2 = () => { 
  const containerRef = useRef(null);
  const subBannerRef = useRef(null);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const initialLimit = 12;
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [videoUrl, setVideoUrl] = useState(logoreveal1);
  const [aboutId, setAboutId] = useState(null);
  const [brandLogos, setBrandLogos] = useState([]);

  // Parallax for Intro Section
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);
  
  // Parallax for Hero Banner
  const { scrollYProgress: subBannerScroll } = useScroll({ target: subBannerRef, offset: ["start start", "end start"] });
  const bannerY = useTransform(subBannerScroll, [0, 1], ["0%", "30%"]);

  // Fetch about data
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/about/`);
        const data = await response.json();
        
        console.log('Fetched about data:', data);
        
        const aboutData = Array.isArray(data) ? data[0] : data;
        
        if (aboutData) {
          setVideoUrl(aboutData.video_url);
          setAboutId(aboutData.id);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };

    fetchAboutData();
  }, []);

  // Fetch brand logos
  useEffect(() => {
    const fetchBrandLogos = async () => {
      if (!aboutId) return;
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/about/${aboutId}/logos`);
        const data = await response.json();
        
        console.log('Fetched brand logos:', data);
        
        if (data && data.length > 0) {
          setBrandLogos(data.sort((a, b) => a.position - b.position));
        }
      } catch (error) {
        console.error('Error fetching brand logos:', error);
      }
    };

    fetchBrandLogos();
  }, [aboutId]);

 

  const brands = useMemo(() => Array.from({ length: 20 }, (_, i) => ({ id: i + 1, logo: ameyaLogo, name: "Ameya Group" })), []);
  const displayedItems = isExpanded ? brands : brands.slice(0, initialLimit);

  const content = [
    { id: 0, title: "Our Mission", subtitle: "Ameya™ mission", description: "To redefine the landscape of Gurugram by delivering high-quality commercial and residential spaces.", points: ["Uncompromised quality standards", "Customer-centric approach", "Timely project delivery"], image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000" },
    { id: 1, title: "Our Vision", subtitle: "Ameya™ vision", description: "To be the most trusted name in real estate, known for creating landmarks that enhance the urban lifestyle.", points: ["Future-ready architecture", "Sustainable development", "Community-focused designs"], image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000" },
    { id: 2, title: "Our Goal", subtitle: "Ameya™ goals", description: "Integrating advanced smart-home technology and eco-friendly materials into every square foot.", points: ["Enhanced comfort and fit", "Predictable results", "Standard excellence"], image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000" }
  ];

  const approachFeatures = [
    { icon: <MapPin size={24}/>, title: "Excellent Location", desc: "Located in the heart of bustling residential areas, our neighbourhood bazaars cater to the daily essential needs of all residents around them." },
    { icon: <MousePointerClick size={24}/>, title: "Convenient Access", desc: "The bazaars provide convenient access, making it easier for all kinds of customers to have a smooth and satisfying shopping experience." },
    { icon: <LayoutGrid size={24}/>, title: "Zoning For Optimal Experience", desc: "The popularity of the neighbourhood bazaars makes them a landmark for directions for the surrounding areas." },
    { icon: <Footprints size={24}/>, title: "Designed For Repeated Footfalls", desc: "The varied food options attract food enthusiasts from places that are farther away, due to the success of the food haat." },
    { icon: <Wallet size={24}/>, title: "Low CAM Charges", desc: "More savings with low common area maintenance charges compared to shopping malls." }
  ];

  return (
    <main className="w-full bg-white antialiased overflow-x-hidden font-sans">
      
      {/* SECTION 1: HERO BANNER */}
      <section ref={subBannerRef} className="relative w-full h-[50vh] md:h-[100vh] overflow-hidden bg-black ">
        <motion.div style={{ y: bannerY }} className="absolute inset-0 w-full h-full">
         {/* SECTION 1: HERO BANNER */}
<section ref={subBannerRef} className="relative w-full h-full md:h-full overflow-hidden bg-black">
  <motion.div style={{ y: bannerY }} className="absolute inset-0 w-full h-full">
    <Swiper 
      modules={[Autoplay, EffectFade]} 
      effect="fade" 
      speed={2000} 
      autoplay={{ delay: 4000 }} 
      loop={true} 
      className="h-full w-full"
    >
      {[abtbnr1, abtbnr2].map((img, i) => (
        <SwiperSlide key={i}>
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ backgroundImage: `url(${img})` }} 
          />
        </SwiperSlide>
      ))}
    </Swiper>
  </motion.div>
</section>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/0 to-black/100 z-10" />
        <div className="relative z-20 h-full w-full flex flex-col justify-end pb-12 md:pb-16">
          <div className="max-w-[1450px] w-full mx-auto text-left px-6 md:px-6">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-[48px] font-serif text-white leading-tight PlayfairDisplay">About Us</motion.h1>
            <div className="mt-2 md:mt-8"><p className="text-[10px] tracking-[0.2em] md:tracking-[0.4em] text-white/60 uppercase font-bold CadillacGothic-Regular">Home <span className="mx-2 text-white/20">/</span> About Us</p></div>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTRODUCTION */}
      <section ref={containerRef} className="relative w-full overflow-hidden">
        <div className="absolute inset-0 flex flex-col pointer-events-none">
          <div className="h-2/2 w-full bg-white" /><div className="h-1/2 w-full bg-[#28659b]" />
        </div>
        <div className="relative z-10 max-w-[1450px] mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-[#28659b] text-[12px] md:text-[14px] tracking-[0.4px] uppercase font-bold mb-4 CadillacGothic-Regular">A Trusted Name in Gurugram Real Estate</motion.span>
          <h2 className="xs:text-[18px] text-[28px] md:text-[34px] lg:text-[38px] xl:text-[48px] font-serif text-black mb-10 tracking-tight PlayfairDisplay">Meet Ameya Group</h2>
          <p className="max-w-5xl text-[14px] md:text-[15px] text-[#000] font-light leading-[1.5] CadillacGothic-Regular mb-6 px-4 text-center">Ameya Group is a Gurugram-based real estate development company driven by a clear vision to create thoughtfully planned spaces that integrate seamlessly into everyday urban life. With a strong understanding of how people live, work, shop, and connect, the group focuses on developing destinations that remain relevant, active, and valuable over time.
          </p>
          <p className="max-w-4xl text-[15px] md:text-[15px] text-[#000] font-light leading-[1.5] CadillacGothic-Regular mb-16 px-4">Guided by quality, strategic location selection, and long-term thinking, Ameya Group has consistently delivered developments that balance functionality with experience. Each project is designed to serve both businesses and communities—creating environments that encourage engagement, efficiency, and sustained growth.

</p>

<p className="max-w-4xl text-[15px] md:text-[15px] text-[#000] font-light leading-[1.5] CadillacGothic-Regular mt-[-40px] mb-16 px-4">
  
Positioned at the heart of Gurugram’s evolving growth corridors, Ameya Group continues to respond to the city’s expanding infrastructure, improving connectivity, and modern community needs. Backed by strong demand and investor confidence, the group remains committed to shaping enduring destinations that contribute meaningfully to the city’s future.

  </p>
          <div className="relative w-full max-w-4xl aspect-video rounded-2xl md:rounded-[32px] overflow-hidden shadow-[0_22px_60px_#000000c4]">
            {videoUrl && (videoUrl.toLowerCase().includes('.mp4') || videoUrl.toLowerCase().includes('video')) ? (
              <video 
                src={videoUrl} 
                className="absolute inset-0 w-full h-full object-contain" 
                autoPlay 
                loop 
                muted 
                playsInline
                controls={false}
                onLoadedData={(e) => {
                  e.target.play().catch(err => console.log('Video autoplay failed:', err));
                }}
              />
            ) : (
              <motion.img src={videoUrl} className="absolute inset-0 w-full h-full object-contain" />
            )}
          </div>
        </div>
      </section>
 

      {/* brand logo */}
      {/* Leading Brands Section */}
      <section className="py-16 md:py-20 lg:py-24 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="xs:text-[18px] text-[24px] md:text-[28px] lg:text-[32px] xl:text-[38px] font-serif text-gray-900 leading-tight">
              Leading Brands at   Sapphire  
            </h2>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-6 md:gap-6 lg:gap-6 items-center justify-items-center">
            {brandLogos.length > 0 ? (
              brandLogos.map((brand, index) => (
                <div key={brand.id} className="flex items-center justify-center h-16 md:h-14">
                  <img 
                    src={brand.image_url} 
                    alt={`Brand ${index + 1}`} 
                    className="max-h-full max-w-full object-contain" 
                  />
                </div>
              ))
            ) : (
              <>
                {/* Default fallback logos */}
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/908078696Titan Eyeplis.jpg" alt="Titan Eyeplus" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/raymond.jpg" alt="The Raymond Shop" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/cross.jpg" alt="Crocs" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/apollo.jpg" alt="Apollo Pharmacy" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/lenskart.jpg" alt="Lenskart" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/holiday.jpg" alt="Holiday Inn" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/bodycar.jpg" alt="Bodycare" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/geetanjli.jpg" alt="Geetanjali" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/pantaloom.jpg" alt="Pantaloons" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/clove.jpg" alt="Clove Dental" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/archies.jpg" alt="Archies" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/hdfc.jpg" alt="HDFC Bank" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/inox.jpg" alt="INOX" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/harish.jpg" alt="Ferns N Petals" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/dominos.jpg" alt="Domino's Pizza" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/subway.jpg" alt="Subway" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/dana.jpg" alt="Dana Choga" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/aiani.jpg" alt="Giani" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/axisbank.jpg" alt="Axis Bank" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/kotak.jpg" alt="Kotak Mahindra Bank" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/induslnd.jpg" alt="IndusInd Bank" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/yochina.jpg" alt="Yo! China" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/wataburget.jpg" alt="Wat-A-Burger" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/giswan.jpg" alt="Dimsum Shakti" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/g.jpg" alt="Cafe Coffee Day" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/tataimg.jpg" alt="Tata 1mg" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center h-16 md:h-14">
                  <img src="/img/bata.jpg" alt="Bata" className="max-h-full max-w-full object-contain" />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* UPDATED SECTION: RUNNING COUNTERS */}
      <Aboutcounters />
      
      <Aboutvismis />

     
 
 
            {/* CORE VALUES */}
            {/* <Aboutcorevalues /> */}
              <Abtcorevalues />
            {/* TEAM SECTION */}
            <Aboutteam /> 

            {/* APPROACH SECTION */}
            {/* <Aboutapproach /> */}
            {/* SECTION 3: CONTACT CTA */}
            <ContactCTA />
   

    </main>
  );
};

export default About2;