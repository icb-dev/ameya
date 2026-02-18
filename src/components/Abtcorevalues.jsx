import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Users, 
  Lightbulb, 
  TrendingUp,
  Leaf,
  Award
} from 'lucide-react';

const coreValues = [
  { id: 1, title: "INTEGRITY", description: "We uphold integrity by honoring our commitments, staying client-centric, and avoiding any practices that may compromise trust.", icon: <ShieldCheck size={50} /> },
  { id: 2, title: "CUSTOMER FIRST", description: "Our customers are at the heart of our universe, driving every decision we make.", icon: <Users size={50} /> },
  { id: 3, title: "INNOVATION", description: "Breaking boundaries with creative designs and futuristic engineering.", icon: <Lightbulb size={50} /> },
  { id: 4, title: "GROWTH", description: "Continuously evolving to set new benchmarks in the real estate industry.", icon: <TrendingUp size={50} /> }, 
  { id: 5, title: "Quality", description: "We deliver uncompromising quality by setting high standards and consistently earning our customers’ trust through excellence.", icon: <Award size={50} /> }, 
  { id: 6, title: "Sustainability", description: " We design and build with a long-term vision, focusing on energy efficiency, water-sensitive planning, and environmental responsibility.", icon: <Leaf size={50} /> },
];

const Abtcorevalues = () => {
  return (
    <section className="w-full py-20 bg-[#ffffff] flex justify-center overflow-hidden">
      <div className="w-full max-w-[1450px] px-4 md:px-6">
        
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="xs:text-[18px] text-[32px] md:text-[34px] lg:text-[38px] xl:text-[48px] tracking-tight font-serif text-[#000000] mb-4 PlayfairDisplay"
          >
            Our Core Values
          </motion.h2>
          <div className="h-[2px] w-24 bg-[#9d2a2a] mx-auto"></div>
        </div>

        {/* Static Grid Container - 3 Columns on Desktop, 2 on Tablet, 1 on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 lg:gap-16 px-4">
          {coreValues.map((value, index) => (
            <motion.div 
              key={value.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex justify-center items-center"
            >
              <div className="
                group relative 
                w-full aspect-square 
                max-w-[320px] md:max-w-[380px] lg:max-w-[400px]
                flex-shrink-0
                rounded-full 
                bg-white border-2 border-[#28659b] 
                shadow-[0_15px_40px_rgba(0,0,0,0.12)]
                flex flex-col items-center justify-center p-8 md:p-12
                transition-all duration-500 ease-in-out
                hover:bg-[#28659b] hover:border-transparent hover:-translate-y-2
                cursor-pointer mx-auto overflow-hidden
              ">
                
                {/* Icon */}
                <div className="mb-4 text-[#28659b] group-hover:text-white transition-colors duration-500">
                  {value.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold mb-2 tracking-wider text-slate-800 group-hover:text-white transition-colors duration-500 CadillacGothic-Regular uppercase">
                  {value.title}
                </h3>
                
                {/* Accent Line */}
                <div className="h-[2px] w-12 bg-[#9d2a2a] mx-auto mb-4 group-hover:bg-white transition-colors duration-500"></div>

                {/* Description */}
                <p className="text-[13px] md:text-[14px] leading-relaxed text-black group-hover:text-white transition-colors duration-500 text-center CadillacGothic-Regular px-4">
                  {value.description}
                </p>

                {/* Inner Decorative Circle */}
                <div className="absolute inset-4 rounded-full border border-[#28659b]/10 group-hover:border-white/20 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Abtcorevalues;