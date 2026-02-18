import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import Homeresidentialfeatured from "../assets/images/homeresidentialfeatured.png";

const Homeresidential = () => {
  // CONFIGURATION: Easily adjust formatting and content here
  const settings = {
    sectionBg: "bg-[#f8faff]", // Change background color
    accentColor: "text-[#28659b]", // Blue accent color
    title: "Flagship Residential Project",
    subtitle: "RESIDENTIALS Project", 
    image: Homeresidentialfeatured, 
    imageLink: "/projects/residential", // The destination URL
    // imagePadding: "px-6 md:px-20", 
    maxContentWidth: "max-w-full",
  };

  return (
    <section className={`w-full py-24 ${settings.sectionBg} overflow-hidden`}>
      <div className="container mx-auto px-6 flex flex-col items-center">
        
        {/* 1. TOP CENTER TITLE & SUBTITLE */}
        <div className={`text-center ${settings.maxContentWidth} mb-16`}>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`block text-[13px] tracking-[0.3em] font-bold uppercase mb-4 ${settings.accentColor} CadillacGothic-Regular`}
          >
            {settings.subtitle}
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl md:text-[48px] text-black leading-tight PlayfairDisplay"
          >
            {settings.title}
          </motion.h2> 
        </div>

        {/* 2. CLICKABLE IMAGE SECTION */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`w-full ${settings.imagePadding}`}
        >
          <Link to={settings.imageLink} className="block group">
            <div className="relative aspect-[16/9] overflow-hidden rounded-sm shadow-2xl">
              <img 
                src={settings.image} 
                alt="Residential Development" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center"> 
              </div>
            </div>
          </Link>
        </motion.div> 
      </div>
    </section>
  );
};

export default Homeresidential;