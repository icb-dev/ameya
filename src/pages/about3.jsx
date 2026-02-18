import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

// --- SWIPER STYLES ---
import 'swiper/css';
import 'swiper/css/effect-fade';

const About2 = () => {
  const containerRef = useRef(null);
  
  // Parallax Logic: Image moves down as user scrolls down
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const bannerImages = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000"
  ];

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden bg-black"
    >
      {/* 1. BACKGROUND SLIDER (Images Only) */}
      <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          speed={2000}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          className="h-full w-full"
        >
          {bannerImages.map((img, index) => (
            <SwiperSlide key={index}>
              <div 
                className="w-full h-full bg-cover bg-center" 
                style={{ backgroundImage: `url(${img})` }} 
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {/* 2. GRADIENT OVERLAY (Linear & Radial for depth) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/80 z-10" />

      {/* 3. STATIONARY CONTENT (Centered at 1450px) */}
      <div className="relative z-20 h-full w-full px-6 md:px-16 flex flex-col justify-center">
        <div className="max-w-[1450px] w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-serif text-white leading-[1.1] tracking-tight">
              About  Ameya Group 
            </h1>
          </motion.div>
        </div>
      </div>

      {/* BREADCRUMB INDICATOR (Aligned to 1450px) */}
      <div className="absolute bottom-10 left-0 w-full px-6 md:px-16 z-20">
        <div className="max-w-[1450px] mx-auto">
            <p className="text-[10px] tracking-[0.4em] text-white/60 uppercase font-bold">
            Home <span className="mx-2 text-white/20">/</span> About Us
            </p>
        </div>
      </div>
    </section>

    
  );
};


export default About2;