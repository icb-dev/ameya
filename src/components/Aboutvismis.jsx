import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Target } from 'lucide-react';

import vision from "../assets/images/v1.jpg";
import mision from "../assets/images/m1.jpg";

const Aboutvismis = () => {
  const data = {
    vision: {
      title: "Our Vision",
      subtitle: "THE FUTURE WE BUILD",
      description: "To create enduring urban destinations that add long-term value to cities, communities, and investors & empowers local business & brands.",
      image: vision,
      icon: <Eye size={32} />
    },
    mission: {
      title: "Our Mission",
      subtitle: "THE PURPOSE WE SERVE",
      description: "To deliver thoughtfully planned, high-quality developments through strategic locations, design excellence, and timely execution.",
      image: mision,
      icon: <Target size={32} />
    }
  };

  return (
    <section className="w-full py-20 md:py-32 bg-[#f1f8ff] overflow-hidden flex justify-center">
      <div className="w-full max-w-[1450px] px-6 flex flex-col items-center">
        
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#28659b] font-bold tracking-[0.3em] text-[12px] md:text-[14px] uppercase mb-2 CadillacGothic-Regular"
          >
            Guiding Principles
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="xs:text-[18px] text-[26px] md:text-[34px] lg:text-[32px] xl:text-[48px] font-serif text-black tracking-tight PlayfairDisplay"
          >
            Our Mission & Vision
          </motion.h2>
          <div className="h-[2px] w-16 md:w-20 bg-blue-600 mx-auto mt-4"></div>
        </div>

        {/* Static 2-Column Grid */}
        <div className="w-full flex flex-col lg:flex-row min-h-[700px] md:min-h-[800px] lg:min-h-[550px] gap-6">
          {Object.entries(data).map(([key, content]) => (
            <div
              key={key}
              className="relative overflow-hidden rounded-[2rem] flex-1 w-full group shadow-xl"
            >
              {/* Background Image Container */}
              <div className="absolute inset-0">
                <img
                  src={content.image}
                  alt={content.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/70" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>

              {/* Content Overlay - Static and always visible */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 md:p-12 text-center">
                
                {/* Icon */}
                <div className="mb-4 p-4 rounded-full border bg-blue-600 border-blue-600 text-white">
                  <div className="scale-90 lg:scale-100">
                    {content.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="xs:text-[18px] text-[26px] md:text-[34px] lg:text-[32px] xl:text-[40px] font-serif text-white tracking-tight PlayfairDisplay leading-tight">
                  {content.title}
                </h3>

                {/* Subtitle & Description - Now fixed/static */}
                <div className="mt-2">
                  <p className="text-white font-bold text-[10px] md:text-[12px] tracking-[0.2em] mb-4 md:mb-6 CadillacGothic-Regular opacity-90">
                    {content.subtitle}
                  </p>
                  <p className="text-slate-200 text-[15px] md:text-[17px] leading-relaxed max-w-lg mx-auto font-light CadillacGothic-Regular px-2">
                    {content.description}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Aboutvismis;