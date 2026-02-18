import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
// Added 'Users' icon for the 6th slide
import { Clock, Award, Building2, Handshake, Users } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';

const CoreValues = () => {
  const settings = {
    sectionBg: "bg-[#fcfcfc]",
    cardBg: "bg-white",
    accentColor: "bg-[#9d2a2a]",
    titleFont: "font-serif",
    bodyFont: "font-sans",
    autoScrollSpeed: 3000,
  };

  const values = [
    { icon: <Clock size={80} strokeWidth={1} />, title: "Timely Delivery" },
    { icon: <Award size={80} strokeWidth={1} />, title: "World Class Quality" },
    { icon: <Building2 size={80} strokeWidth={1} />, title: "Contemporary Designs" },
    { icon: <Handshake size={80} strokeWidth={1} />, title: "Top Class Partners" },
    { icon: <Handshake size={80} strokeWidth={1} />, title: "Integrity & Trust" },
    // 1. ADDED ONE MORE SLIDE (6th Item)
    { icon: <Users size={80} strokeWidth={1} />, title: "Customer Centricity" }
  ];

  return (
    <section className={`py-24 px-6 ${settings.sectionBg}`}>
      <div className="max-w-[1600px] mx-auto">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-4xl md:text-5xl ${settings.titleFont} text-gray-900`}
          >
            Our Values
          </motion.h2>
        </div>

        <div className="relative pb-24"> 
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: settings.autoScrollSpeed,
              disableOnInteraction: false,
            }}
            pagination={{ 
              clickable: true, 
              dynamicBullets: false, 
              el: '.custom-pagination'
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
              1536: { slidesPerView: 5 }, 
            }}
            className="!overflow-visible"
          >
            {values.map((item, index) => (
              <SwiperSlide key={index} className="pb-4">
                <motion.div 
                  whileHover={{ y: -10 }}
                  // 2. REDUCED HEIGHT: Changed h-[340px] to h-[260px]
                  className={`${settings.cardBg} group hover:bg-[#28659b] transition-colors duration-300 h-[260px] p-6 flex flex-col justify-between shadow-xl shadow-gray-200/60 border border-gray-100 rounded-sm cursor-pointer`}
                >
                  <div className="text-black group-hover:text-white transition-colors duration-300">
                    {item.icon}
                  </div>
                  
                  <div>
                    <h3 className={`text-2xl ${settings.bodyFont} font-bold NeueHaasDisplay-Roman text-black group-hover:text-white mb-3 leading-tight tracking-tight transition-colors duration-300`}>
                      {item.title}
                    </h3>
                    
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "60px" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-[2px] ${settings.accentColor} group-hover:bg-white transition-colors duration-300`}
                    />
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="custom-pagination absolute bottom-0 left-0 right-0 flex justify-center items-center gap-2" />
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-pagination .swiper-pagination-bullet {
          background: #000 !important;
          opacity: 0.15;
          width: 10px !important;
          height: 10px !important;
          border-radius: 50% !important;
          margin: 0 !important;
          transition: all 0.3s ease;
          border: none;
          display: inline-block;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background: #9d2a2a !important;
          opacity: 1;
          transform: scale(1.2);
          width: 10px !important;
          height: 10px !important;
          border-radius: 50% !important;
        }
      `}} />
    </section>
  );
};

export default CoreValues;