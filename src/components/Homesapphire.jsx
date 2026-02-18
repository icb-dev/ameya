import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// IMPORTANT: Ensure this file exists at this exact path
import sapphirebg from "../assets/images/shaphirebnrbg.png";
 
const Homesapphire = () => {
  const [settings, setSettings] = useState({
    bgImage: sapphirebg,
    subtitle: "Welcome to The World of",
    // titleMain: "The World of", 
    titleHighlight: "Sapphire", 
    highlightGradient: "from-[#99c8ff] via-[#ffffff] to-[#99c8ff]", 
      // highlightGradient: "from-[#fff] via-[#fff] to-[#fff]", 
    buttonText: "Explore Projects",
    buttonUrl: "#",
    overlayOpacity: "bg-black/85", 
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/home`);
        const data = await response.json();
        
        console.log('Fetched home data:', data);
        
        // API returns an array, get the first item
        const homeData = Array.isArray(data) ? data[0] : data;
        
        if (homeData) {
          setSettings(prevSettings => ({
            ...prevSettings,
            bgImage: homeData.banner_image,
            subtitle: homeData.title,
            titleHighlight: homeData.large_title,
            buttonUrl: homeData.button_url,
          }));
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      
      {/* 1. FIXED BACKGROUND IMAGE */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${settings.bgImage})` }}
      />

      {/* 2. BACKGROUND OVERLAY */}
      <div className={`absolute inset-0 z-10 ${settings.overlayOpacity}`} />

      {/* 3. CENTER CONTENT */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative z-20 text-center px-6 max-w-5xl flex flex-col items-center"
      > 

        {/* SUBTITLE */}
        {settings.subtitle && (
          <motion.p 
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white text-[18px] md:text-[18px] lg:text-[28px] xl:text-[28px] tracking-[0.4px]  mt-12 CadillacGothic-Regular"
          >
            {settings.subtitle}
          </motion.p>
        )}

        {/* TITLE SECTION */}
        <h2 className="text-[44px] md:text-[54px] lg:text-[64px] xl:text-[74px] text-white font-light tracking-tight mb-62 md:mb-32 Ameyasans-WideMedium leading-[1.1]">
          <span className="tracking-wide">{settings.titleMain} </span>
          
          {/* RESTRUCTURED SPAN:
            1. px-6: Adds internal space so the gradient background covers the "lean" of the italics.
            2. -mx-6: Pulls the "The World of" and the surrounding space back so the gap isn't too wide.
            3. py-2: Prevents vertical clipping on taller serif letters.
          */}
          <span 
            className={`
              inline-block  font-medium 
              bg-gradient-to-r ${settings.highlightGradient} 
              bg-clip-text text-transparent 
              px-6 py-2 -mx-6 tracking-wide uppercase
              overflow-visible text-[36px] md:text-[52px] lg:text-[68px] xl:text-[92px]
            `}
            style={{ WebkitBackgroundClip: 'text' }}
          >
            "{settings.titleHighlight}"
          </span>
        </h2>

        {/* INTERACTIVE BUTTON */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = settings.buttonUrl}
          className="relative group overflow-hidden px-12 py-4 text-white uppercase text-[12px] md:text-[14px] tracking-[2.2px] font-bold transition-all duration-500 hover:text-black CadillacGothic-Regular bg-[#28659b] cursor-pointer"
        >
          <span className="relative z-10">{settings.buttonText}</span>
          <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
        </motion.button>
      </motion.div>

    </section>
  );
};

export default Homesapphire;