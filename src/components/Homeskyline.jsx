import React from 'react';
import { motion } from 'framer-motion';
// Replace this with your actual skyline image path
import skyline from "../assets/images/skyline.png"; 

const Homeskyline = () => {
  return (
    /* RESPONSIVE HEIGHT: 
       - Default (Mobile): h-[60vh] to avoid excessive white space
       - md (768px): h-[75vh]
       - lg (1024px+): h-[85vh] (Original)
    */
    <section className="relative w-full xs:h-[70vh] md:h-[65vh] lg:h-[85vh] h-[50vh]  flex justify-center overflow-hidden bg-white">
      
      {/* BACKGROUND IMAGE CONTAINER */}
      <div 
        className="absolute inset-0 z-0 bg-no-repeat transition-all duration-700"
        style={{ 
          backgroundImage: `url(${skyline})`,
          backgroundPosition: 'bottom center',
          backgroundSize: 'cover',             
        }}
      />

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/80 via-white/20 to-transparent" />

      {/* CONTENT CONTAINER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        /* RESPONSIVE PADDING & WIDTH:
           - pt-12 for 320px/425px
           - md:pt-20 for 768px
           - lg:pt-26 for 1024px
        */
        className="relative z-20 text-center px-6 pt-22 md:pt-20 lg:pt-32 max-w-[85%]"
      >
        {/* SUBHEADING: Scaled for 320px/425px */}
        <span className="text-[#28659b] text-[10px] md:text-[12px] lg:text-[14px] uppercase tracking-[0.2em]   font-bold mb-3 md:mb-4 block CadillacGothic-Regular lg:tracking-[0.1em]">
        Sapphire Legacy by Ameya Group
        </span>
        
        {/* RESPONSIVE PARAGRAPH FONT SIZES:
           - 320px: text-[16px]
           - 425px: text-[18px]
           - 768px: text-[24px]
           - 1024px: text-[28px]
           - xl: text-[32px] (Original)
        */}
        <p className="text-black text-[18px] xs:text-[18px] md:text-[16px] lg:text-[4px] xl:text-[25px] max-w-[100%] md:max-w-[90%] lg:max-w-[90%] xl:max-w-[100%] mx-auto CadillacGothic-Regular leading-[1.3] tracking-tight">
        Guided by Ameya Group’s vision for thoughtfully designed spaces that empower local businesses, emerging entrepreneurs, and established brands, Our Sapphire Journey Began with the Success of The Sapphire in Sector 49. This milestone laid the foundation for a legacy of landmark developments across Gurugram’s most promising locations—spanning curated commercial destinations as well as refined residential spaces designed to elevate modern living.
        </p>
      </motion.div>

    </section>
  );
};

export default Homeskyline;