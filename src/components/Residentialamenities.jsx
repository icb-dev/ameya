import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation} from 'swiper/modules';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const Residentialamenities = () => {
  // --- ADJUSTABLE SETTINGS ---
  const settings = {
    sectionBg: "bg-[#f1f8ff]", // Light Gray
    cardBg: "bg-white",
    shadow: "shadow-[0_10px_30px_rgba(0,0,0,0.1)]", // Adjustable shadow
    primaryColor: "bg-[#28659b]", // Blue
    hoverColor: "hover:bg-black",
    titleFont: "PlayfairDisplay", // Serif Font
  };

  // State to force re-render once refs are attached
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  const amenities = [
    { title: "Medizone", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800" },
    { title: "Retail Arcade", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800" },
    { title: "Food Haat", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800" },
    { title: "Hyper Market", img: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=800" },
    { title: "Secured Parking", img: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=800" },
  ];

  return (
    <section className={`py-24 px-6 ${settings.sectionBg}`}>
      <div className="max-w-[1450px] mx-auto">

        {/* 1. TOP CENTER TITLE & SUBTITLE */}
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#28659b] text-[12px] font-bold uppercase tracking-[0.3em] mb-4 CadillacGothic-Regular"
          >
            Premium Facilities
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`text-4xl md:text-[48px] ${settings.titleFont} text-black tracking-tight`}
          >
            Sapphire Residences Amenities
          </motion.h2>
        </div>

        {/* 2. CAROUSEL */}
        <div className="relative mb-16 px-4">
          <Swiper
            modules={[Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            // autoplay={{ delay: 4000 }}
            /* THE FIX: Use state for navigation elements */
            navigation={{
              prevEl,
              nextEl,
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="py-10"
          >
            {amenities.map((item, index) => (
              <SwiperSlide key={index}>
                {/* 4. FLIP ANIMATION & 5. BOX SHADOW */}
                <motion.div
                  initial={{ rotateY: 90, opacity: 0 }}
                  whileInView={{ rotateY: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`group ${settings.cardBg} ${settings.shadow} rounded-sm overflow-hidden cursor-pointer h-full border border-gray-100`}
                >
                  {/* 3. SQUARE IMAGE & HOVER ZOOM */}
                  <div className="aspect-square overflow-hidden w-full relative">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* TITLE */}
                  <div className="p-6 text-center bg-white transition-colors duration-300 group-hover:bg-[#28659b]">
                    <h3 className={`text-[24px] ${settings.titleFont} font-medium text-black group-hover:text-white transition-colors`}>
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 7. NAVIGATION AROUND BUTTON */}
        <div className="flex items-center justify-center gap-6">
          
          {/* Custom Prev Button */}
          <button 
            ref={(node) => setPrevEl(node)}
            className="w-14 h-14 rounded-full border border-black/50 flex items-center justify-center hover:bg-[#28659b] hover:text-white hover:border-[#28659b] transition-all duration-300 disabled:opacity-30"
          >
            <ChevronLeft size={28} />
          </button>

          {/* 6. EXPLORE BUTTON (SLIDE UP ON HOVER) */}
          {/* <motion.button
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`${settings.primaryColor} ${settings.hoverColor} text-white px-10 py-4 rounded-full flex items-center gap-3 font-medium tracking-wide transition-all duration-300 shadow-xl group CadillacGothic-Regular`}
          >
            EXPLORE ALL FEATURES 
          </motion.button> */}

          {/* Custom Next Button */}
          <button 
            ref={(node) => setNextEl(node)}
            className="w-14 h-14 rounded-full border border-black/50 flex items-center justify-center hover:bg-[#28659b] hover:text-white hover:border-[#28659b] transition-all duration-300 disabled:opacity-30"
          >
            <ChevronRight size={28} />
          </button>

        </div>
      </div>
    </section>
  );
};

export default Residentialamenities;