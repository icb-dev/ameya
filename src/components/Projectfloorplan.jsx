import React, { useRef } from 'react'; 
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

// Correct Image Import
import pfloorplans from "../assets/images/pfloorplans.jpg";

// Swiper Styles
import 'swiper/css';
import 'swiper/css/navigation';

 

const Projectfloorplan = ({ projectTitle }) => {
  const floorSwiper = useRef(null);

  const floorPlansData = [
    // { title: "Basement Floor Plan", image: { src: pfloorplans } },
    { title: "Ground Floor Plan", image: { src: pfloorplans } },
    { title: "First Floor Plan", image: { src: pfloorplans } },
    { title: "Second Floor Plan", image: { src: pfloorplans } },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#fcfcfc] overflow-hidden">
      <div className="max-w-[1450px] mx-auto px-6">
        
        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
             <p className="text-[#28659b] text-[12px] font-bold uppercase tracking-[0.3em] mb-4 CadillacGothic-Regular">
               Architecture & Plans
             </p>
             <h2 className="xs:text-[22px] text-[28px] md:text-[34px] lg:text-[36px] xl:text-[48px] font-serif text-gray-900 PlayfairDisplay tracking-tight">
                {projectTitle ? `${projectTitle} ` : ''}Floor Plans
             </h2>
          </motion.div>
        </div>

        {/* CAROUSEL CONTAINER */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Swiper
              onSwiper={(s) => (floorSwiper.current = s)}
              modules={[Navigation]}
              spaceBetween={30} // Space between cards
              slidesPerView={1}  // Default for mobile
              loop={true}
              centeredSlides={false} // Ensures they align to the left/right edges
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                // Tablet: Show exactly 2
                768: { 
                  slidesPerView: 2,
                  spaceBetween: 30 
                },
                // Desktop: Show exactly 3 (No half-slides)
                1024: { 
                  slidesPerView: 3, 
                  spaceBetween: 40 
                } 
              }}
              className="mySwiper"
            >
              {floorPlansData.map((plan, i) => (
                <SwiperSlide key={i}>
                  <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm group cursor-pointer h-full">
                    
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden rounded-2xl mb-6 bg-[#f8f8f8]">
                      <img 
                        src={plan.image.src} 
                        className="w-full h-full object-contain p-8 mix-blend-multiply opacity-60 blur-[10px] group-hover:blur-0 group-hover:opacity-100 transition-all duration-700 ease-in-out" 
                        alt={plan.title} 
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                          <Maximize2 className="text-black" size={20} />
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 px-4 py-1 rounded-full text-[9px] font-bold tracking-tighter uppercase text-black pointer-events-none group-hover:opacity-0 transition-opacity">
                        Hover to Reveal
                      </div>
                    </div>

                    <h5 className="text-center font-bold text-gray-800 uppercase text-[12px] tracking-[0.2em] CadillacGothic-Regular">
                      {plan.title}
                    </h5>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col items-center justify-center mt-12 gap-8">
          <div className="flex items-center justify-center gap-6">
            <button 
              onClick={() => floorSwiper.current?.slidePrev()} 
              className="p-4 border border-black/50 rounded-full hover:bg-black hover:text-white transition-all shadow-sm group"
            >
              <ChevronLeft size={24} />
            </button>

            <button 
              onClick={() => floorSwiper.current?.slideNext()} 
              className="p-4 border border-black/50 rounded-full hover:bg-black hover:text-white transition-all shadow-sm group"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <p className="text-[10px] text-center text-gray-600 uppercase tracking-widest CadillacGothic-Regular">
            *Detailed architectural drawings available upon request
          </p>
        </div>
      </div>
               
      
    </section>
  );
};

export default Projectfloorplan;