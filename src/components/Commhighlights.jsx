import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { 
  Building2, ShieldCheck, Zap, Car, 
  Users, Globe, Leaf, Clock, 
  Cpu, Briefcase, Coffee, Gem,
  ChevronLeft, ChevronRight, MousePointer2
} from 'lucide-react';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const Commhighlights = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const topRow = [
    { icon: <Building2 />, title: "Signature collaboration", desc: "Between Ameya Group & Global Architects" },
    { icon: <Leaf />, title: "Expansive green", desc: "Spaced gardens & landscaped zones" },
    { icon: <Gem />, title: "Expansive green spaces", desc: "& terraced gardens" },
    { icon: <MousePointer2 />, title: "Low-density design", desc: "Ensuring privacy and exclusivity" },
    { icon: <Layout />, title: "Premium Italian marble", desc: "Flooring & smart amenities" },
    { icon: <Briefcase />, title: "Dynamic co-working hubs", desc: "& business lounges" }
  ];

  const bottomRow = [
    { icon: <CreditCard />, title: "High-speed lobbies", desc: "Double height entrance areas" },
    { icon: <Settings />, title: "Integrated smart building", desc: "Management systems & IoT" },
    { icon: <ShieldCheck />, title: "24/7 surveillance", desc: "With biometric access control" },
    { icon: <Users />, title: "Rooftop wellness center", desc: "& leisure zones" },
    { icon: <Zap />, title: "Rooftop wellness center", desc: "& leisure zones" },
    { icon: <Car />, title: "Ample EV-ready", desc: "Parking facilities for all" }
  ];

  const flipVariant = {
    hidden: { rotateY: 110, opacity: 0 },
    visible: (i) => ({
      rotateY: 0,
      opacity: 1,
      transition: { delay: i * 0.1, duration: 0.8, ease: "easeOut" }
    })
  };

  return (
    <section className="py-24 bg-[#111111] relative overflow-hidden font-sans text-white">
      {/* 1. Header Section */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-[#28659b] text-sm font-bold tracking-[0.4em] uppercase block mb-4"
        >
          EXCLUSIVE FEATURES
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-serif uppercase tracking-tight"
        >
          COMMERCIAL HIGHLIGHTS
        </motion.h2>
      </div>

      <div className="max-w-[1600px] mx-auto px-6">
        
        {/* Top Row */}
        <div className="mb-20">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1.5}
            loop={true}
            breakpoints={{
              768: { slidesPerView: 3 },
              1200: { slidesPerView: 6 }
            }}
            autoplay={{ delay: 4000 }}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          >
            {topRow.map((item, idx) => (
              <SwiperSlide key={`top-${idx}`} style={{ perspective: '1000px' }}>
                <motion.div
                  custom={idx}
                  initial="hidden"
                  whileInView="visible"
                  variants={flipVariant}
                  className="group relative border border-amber-200/30 bg-transparent p-6 rounded-xl h-[220px] flex flex-col items-center justify-center text-center transition-all duration-500 hover:bg-[#28659b]/20 hover:border-[#28659b]"
                >
                  <div className="mb-4 text-white group-hover:scale-110 transition-transform duration-500">
                    {React.cloneElement(item.icon, { size: 40, strokeWidth: 1 })}
                  </div>
                  <h4 className="text-sm font-semibold mb-2 leading-tight">{item.title}</h4>
                  <p className="text-[11px] text-gray-400 leading-snug">{item.desc}</p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Middle Navigation UI (From Image) */}
        <div className="flex items-center justify-center gap-12 my-12">
           <button 
             ref={prevRef}
             className="text-[#28659b] hover:text-white transition-colors"
           >
             <ChevronLeft size={48} strokeWidth={1} />
           </button>

           <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Circular Border with Gap */}
              <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-[#28659b] border-r-[#28659b] rounded-full rotate-45"></div>
              <div className="bg-white/5 rounded-full p-6">
                <ChevronRight size={40} className="text-white" />
              </div>
           </div>

           <button 
             ref={nextRef}
             className="text-[#28659b] hover:text-white transition-colors"
           >
             <ChevronRight size={48} strokeWidth={1} />
           </button>
        </div>

        {/* Bottom Row */}
        <div className="mt-20">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1.5}
            loop={true}
            breakpoints={{
              768: { slidesPerView: 3 },
              1200: { slidesPerView: 6 }
            }}
            autoplay={{ delay: 4500, reverseDirection: true }}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          >
            {bottomRow.map((item, idx) => (
              <SwiperSlide key={`bottom-${idx}`} style={{ perspective: '1000px' }}>
                <motion.div
                  custom={idx + 6}
                  initial="hidden"
                  whileInView="visible"
                  variants={flipVariant}
                  className="group relative border border-amber-200/30 bg-transparent p-6 rounded-xl h-[220px] flex flex-col items-center justify-center text-center transition-all duration-500 hover:bg-[#28659b]/20 hover:border-[#28659b]"
                >
                  <div className="mb-4 text-white group-hover:scale-110 transition-transform duration-500">
                    {React.cloneElement(item.icon, { size: 40, strokeWidth: 1 })}
                  </div>
                  <h4 className="text-sm font-semibold mb-2 leading-tight">{item.title}</h4>
                  <p className="text-[11px] text-gray-400 leading-snug">{item.desc}</p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

// Mock components for missing Lucide icons used in data
const Layout = (props) => <Building2 {...props} />;
const CreditCard = (props) => <Gem {...props} />;
const Settings = (props) => <Cpu {...props} />;

export default Commhighlights;