import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Search, PenTool, CheckCircle, ShieldCheck } from 'lucide-react';
// import ctabg3 from " ";

const ProjectApproach = () => {
  const steps = [
    {
      icon: <Search size={56} strokeWidth={1} />, // Increased Icon Size
      title: "EXCELLENT LOCATION",
      desc: "Located in the heart of bustling residential areas, our neighbourhood bazaars cater to the daily essential needs of all residents around them."
    },
    {
      icon: <Lightbulb size={56} strokeWidth={1} />, // Increased Icon Size
      title: "CONVENIENT ACCESS",
      desc: "The bazaars provide convenient access, making it easier for all kinds of customers to have a smooth and satisfying shopping experience"
    },
    {
      icon: <PenTool size={56} strokeWidth={1} />, // Increased Icon Size
      title: "ZONING FOR OPTIMAL EXPERIENCE",
      desc: "The popularity of the neighbourhood bazaars makes them a landmark for directions for the surrounding areas."
    },
    {
      icon: <CheckCircle size={56} strokeWidth={1} />, // Increased Icon Size
      title: "DESIGNED FOR REPEATED FOOTFALLS",
      desc: "The varied food options attract food enthusiasts from places that are farther away, due to the success of the food haat."
    },
    {
      icon: <ShieldCheck size={56} strokeWidth={1} />, // Increased Icon Size
      title: "LOW CAM CHARGES",
      desc: "More savings with low common area maintenance charges compared to shopping malls."
    }
  ];

  return (
    <section className="relative py-24 px-6 overflow-hidden min-h-[650px] flex items-center" >
      {/* 1. FIXED BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-black" />

      <div className="relative z-20 max-w-[1450px] mx-auto w-full">
        
        {/* 2. TITLE SECTION */}
        <div className="text-center mb-20">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-blue-400 text-[11px] font-bold uppercase tracking-[0.4em] mb-4 CadillacGothic-Regular"
          >
            Guiding Your Vision
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="xs:text-[22px] text-[28px] md:text-[36px] lg:text-[38px] xl:text-[48px] font-serif text-white tracking-tight PlayfairDisplay"
          >
            Ameya’s Approach to Community Shopping
          </motion.h2>
        </div>

        {/* 3. INTERACTIVE GRID - Set to 5 Columns for Large Screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 border border-white/10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ rotateY: 90, opacity: 0 }}
              whileInView={{ rotateY: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15, 
                ease: "easeOut" 
              }}
              
              whileHover={{ 
                backgroundColor: "#28659b",
                transition: { duration: 0.3, delay: 0 } 
              }}
              
              className="relative flex flex-col items-center text-center p-6 group cursor-pointer border-white/10 border-b md:border-b-0 lg:border-r last:border-r-0"
            >
              {/* ICON */}
              <div className="text-white mb-8 transition-transform duration-300 group-hover:scale-110">
                {step.icon}
              </div>
              
              {/* TITLE - Set to Capitalize */}
              <h3 className="text-[20px] font-serif text-white mb-4 PlayfairDisplay capitalize leading-tight">
                {step.title.toLowerCase()}
              </h3>
              
              {/* DESCRIPTION */}
              <p className="text-gray-300 group-hover:text-white text-sm leading-relaxed CadillacGothic-Regular transition-colors duration-300">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectApproach;