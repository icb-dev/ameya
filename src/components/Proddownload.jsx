import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

const Proddownload = () => {
  const downloadLinks = [
    { name: "BROCHURE", fileUrl: "/#" },
    { name: "FLOOR PLANS", fileUrl: "/#" },
    { name: "CONSTRUCTION UPDATES", fileUrl: "/#" },
  ];

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center">
        
        {/* 1. HEADER WITH RED ACCENT */}
        <div className="flex items-center gap-4 mb-16">
          <div className="w-14 h-[3px] bg-[#922b21]" />
          <span className="text-[14px] font-bold tracking-[0.5em] text-gray-800 CadillacGothic-Regular uppercase">
            DOWNLOADS
          </span>
        </div>

        {/* 2. UNIFORM BUTTON GRID */}
        <div className="flex flex-wrap justify-center gap-8 w-full">
          {downloadLinks.map((item, index) => (
            <motion.a
              key={index}
              href={item.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              
              /* PAGE LOAD FLIP ANIMATION */
              initial={{ rotateX: -90, opacity: 0 }}
              whileInView={{ rotateX: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2, 
                ease: "easeOut" 
              }}

              /* INTERACTIVE HOVER */
              whileHover="hover"
              className="relative group overflow-hidden border border-black rounded-full w-full max-w-[320px] h-[60px] flex items-center justify-center cursor-pointer transition-all duration-500"
            >
              {/* SLIDE UP BLUE BACKGROUND TRANSITION */}
              <motion.div 
                variants={{
                  hover: { y: 0 }
                }}
                initial={{ y: "102%" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0 bg-[#28659b] z-0"
              />

              {/* CONTENT (TEXT & ICON) */}
              <div className="relative z-10 flex items-center gap-4">
                <span className="text-[16px] font-bold tracking-wide text-black group-hover:text-white CadillacGothic-Regular transition-colors duration-300">
                  {item.name}
                </span>
                
                {/* DOWNLOAD ICON (VISIBLE BY DEFAULT) */}
                <div className="p-1 rounded-full bg-black/5 group-hover:bg-white/20 transition-colors duration-300">
                  <Download 
                    size={18} 
                    className="text-black group-hover:text-white transition-all duration-300 group-hover:scale-110" 
                  />
                </div>
              </div>

              {/* TAP ANIMATION */}
              <motion.div 
                whileTap={{ scale: 0.95 }}
                className="absolute inset-0"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Proddownload;