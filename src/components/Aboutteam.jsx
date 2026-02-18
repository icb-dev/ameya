import React from 'react';
import { motion } from 'framer-motion';

const Aboutteam = () => {
  const teamMembers = [
    {
      name: "Sanjay Gupta",
      description: "A veteran of the real-estate industry with over three decades of experience, Sanjay Gupta performs the crucial role of leading decision-making and operations at Ameya. His foresight and vision have contributed immensely towards the establishment of major benchmarks for Ameya. An inspiration to all around him, he is leading the company into a new era, contributing significantly towards bettering systems, streamlining processes and maximizing efficiency of product delivery, with a focus on fulfilling the needs of the modern Indian consumer.",
      theme: "dark" // Blue Background
    },
    {
      name: "Deepak Gupta",
      description: "He brings over three decades of experience in the real estate sector and has played a pivotal role in shaping the commercial strategy for some of India’s leading real estate organizations. With a strong understanding of market dynamics and execution, he founded Ameya with the vision of building one of India’s most respected commercial real estate enterprises. Driven by a commitment to integrity, quality, and long-term value creation, he continues to guide the organization with principles that place trust, excellence, and sustainable growth at the core of every development.",
      theme: "light" // White Background
    },
    {
      name: "Akshat Gupta",
      description: "The new-generation entrepreneur of the family, Akshat Gupta, serves on the group’s management board. With a degree in Business Management from the United States and a Master’s in Civil and Architectural Engineering from the United Kingdom, he brings a strong academic foundation well aligned with the group’s growing real estate ambitions. He remains focused on steering the organisation towards its goals and objectives, while also being actively involved in nurturing new projects from the inception stage itself, with a clear vision to raise the bar for Ameya in the years to come.",
      theme: "dark" // Blue Background
    }
  ];

  return (
    <section className="py-20 md:py-28 px-6 bg-[#f1f8ff] overflow-hidden">
      <div className="max-w-[1450px] mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#28659b] text-[12px] font-bold uppercase tracking-[0.1em] md:tracking-[0.4em] mb-2 md:mb-4 CadillacGothic-Regular"
          >
            The People Behind Ameya
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            /* Standardized Heading Sizes */
            className="xs:text-[18px] text-[32px] md:text-[34px] lg:text-[38px] xl:text-[48px] font-serif text-black PlayfairDisplay tracking-tight"
          >
            Leadership
          </motion.h2>
          <div className="h-[2px] w-20 bg-blue-600 mx-auto mt-4"></div>
        </div>

        {/* Responsive Grid 
            - Stacked on Mobile
            - 3 Columns on Desktop
            - rounded-3xl applied to the container
        */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 shadow-2xl rounded-[2rem] overflow-hidden">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              /* Animation logic: Subtle fade-in-up for better mobile performance */
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              
              className={`relative p-10 md:p-14 lg:p-12 xl:p-16 flex flex-col items-center text-center transition-all duration-500
                ${member.theme === 'dark' 
                  ? 'bg-[#28659b] text-white' 
                  : 'bg-white text-gray-900 border-y lg:border-y-0 lg:border-x border-gray-100'}`}
            >
              {/* Decorative Quote Mark or Icon space if needed later */}
              <div className={`mb-6 opacity-20 ${member.theme === 'dark' ? 'text-white' : 'text-blue-900'}`}>
                 <div className="h-[1px] w-12 bg-current mx-auto"></div>
              </div>

              {/* Name - Using your sizing for H3 consistency */}
              <h3 className="text-[28px] md:text-[32px] font-serif mb-6 PlayfairDisplay leading-tight">
                {member.name}
              </h3>

              {/* Description - Adjusted for readability across devices */}
              <p className={`text-justify text-[15px] md:text-[15px] leading-[1.8] CadillacGothic-Regular font-light
                ${member.theme === 'dark' ? 'text-blue-50' : 'text-slate-700'}`}>
                {member.description}
              </p>

              {/* Bottom Decoration */}
              <div className="mt-auto pt-8">
                 <div className={`h-[1px] w-15 ${member.theme === 'dark' ? 'bg-[#9d2a2a]' : 'bg-[#9d2a2a]'}`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Aboutteam;