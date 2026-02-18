import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Gem, Stethoscope, ChevronsUp, 
  ShoppingBag, ChevronsRight, Car, Video, Droplets, ArrowUpRight
} from 'lucide-react';

const Residentialhighlights = () => {
  // --- PREMIUM DESIGN SETTINGS ---
  const settings = {
    sectionBg: "bg-[#f1f8ff]", // Light Gray Background
    accentBlue: "#28659b",
    borderCol: "border-gray-100",
  };

  const highlights = [
    { icon: <Building2 strokeWidth={1.2} />, title: "1.80 Lakh Sq. Ft.", sub: "Commercial Dev." },
    { icon: <Gem strokeWidth={1.2} />, title: "Modern Facade", sub: "Architectural" },
    { icon: <Stethoscope strokeWidth={1.2} />, title: "35,000 Sq. Ft.", sub: "Medizone Floor" },
    { icon: <ChevronsUp strokeWidth={1.2} />, title: "Dedicated Escalator", sub: "Vertical Access" },
    { icon: <ShoppingBag strokeWidth={1.2} />, title: "1.35 Lakh Sq. Ft.", sub: "Retail Zone" },
    { icon: <ChevronsRight strokeWidth={1.2} />, title: "High-Speed", sub: "Travelator" },
    { icon: <Car strokeWidth={1.2} />, title: "Ample Parking", sub: "Hassle-free" },
    { icon: <Video strokeWidth={1.2} />, title: "24x7 Secured", sub: "CCTV Security" },
    { icon: <Droplets strokeWidth={1.2} />, title: "Water Supply", sub: "Sustainable" },
    // 10th Slot to complete the 5x2 Grid
    { icon: <ArrowUpRight strokeWidth={1.2} />, title: "View More", sub: "Explore Details", isCTA: true },
  ];

  return (
    <section className={`py-24 px-6 ${settings.sectionBg} overflow-hidden`}>
      <div className="max-w-[1600px] mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-[2px] bg-[#922b21]" />
            <span className="text-[12px] font-bold text-gray-400 uppercase tracking-[0.5em]">Project Features</span>
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight"
          >
            Sapphire Residences Highlights
          </motion.h2>
        </div>

        {/* 5-COLUMN GRID (2 ROWS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 border-t border-l border-gray-100">
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ rotateY: 90, opacity: 0 }}
              whileInView={{ rotateY: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.05 }}
              whileHover="hover"
              className={`relative p-10 border-r border-b ${settings.borderCol} group cursor-pointer overflow-hidden flex flex-col justify-between min-h-[280px] bg-white`}
            >
              {/* SLIDE UP BLUE HOVER */}
              <motion.div 
                variants={{ hover: { y: 0 } }}
                initial={{ y: "101%" }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="absolute inset-0 bg-[#28659b] z-0"
              />

              {/* CONTENT */}
              <div className="relative z-10">
                {/* ICON - Slightly smaller for 5-column fit */}
                <div className={`w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 group-hover:text-white group-hover:border-white/30 transition-all duration-500 mb-8`}>
                  {React.cloneElement(item.icon, { size: 28 })}
                </div>

                <h3 className={`text-xl font-serif ${item.isCTA ? 'italic' : ''} text-gray-900 group-hover:text-white transition-colors duration-500 mb-1 leading-snug`}>
                  {item.title}
                </h3>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest group-hover:text-white/70 transition-colors duration-500 font-bold">
                  {item.sub}
                </p>
              </div>

              {/* ACCENT BOX (Bottom Decorative) */}
              <div className="relative z-10 w-8 h-[2px] bg-[#9d2a2a] group-hover:bg-[#9d2a2a] transition-colors mt-6" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Residentialhighlights;