import React from 'react';
import { motion } from 'framer-motion';

const Residentailmix = () => {
  const categories = [
    {
      title: "SHOPPING",
      img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800",
      desc: "Your one-stop for all sorts of shopping needs is here. Whether you want to get a cake from a bakery, groceries for the month, gadgets from an electronics store, or medicine from a medizone, there is only one place you will need to go. We’re giving convenience a whole new meaning."
    },
    {
      title: "FOOD HAAT",
      img: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=800",
      desc: "For all your culinary adventures, we present a food haat. From high-end cafes to street food, you can fulfil your craving with a wide variety of options. Whether you want to sit and have a good time with friends, work on your projects at a calm corner or get takeaways, every option will be at your disposal."
    },
    {
      title: "MEDIZONE",
      img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800",
      desc: "Medizone is crafted with the intention to give one-place access to all your medical-related needs. From doctors to pharmacists, Medizone is projected with the idea of varied clinical and health support capacities. Due to its proximity to populous areas, ample size, sprawling layout and multiple points of entry, it is an ideal healthcare zone."
    },
    {
      title: "OPEN HANGOUT ZONE",
      img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800",
      desc: "If you are someone who does not like to be confined to indoor spaces, our open zones are the perfect spot for you. As an escape from crowded cafes and restaurants, you can hang out with your family and friends under the open sky. Work on your laptop with a coffee by your side or chat with your friends while clicking hundreds of selfies without worry. Open hangout zones are becoming popular, reminding people of the delight of being out in the open."
    }
  ];

  return (
    <section className="py-24 px-36 bg-white overflow-hidden">
      <div className="max-w-[1450px] mx-auto">
        
        {/* 1. SECTION TITLE (Matching Image Style) */}
        <div className="flex flex-col items-center justify-center mb-16">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-[2px] bg-red-800" /> {/* Red accent line */}
            <span className="text-[14px] font-bold tracking-[0.5em] text-gray-800 CadillacGothic-Regular">
              THE MIX
            </span>
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-[48px] font-serif text-black PlayfairDisplay"
          >
            What's Inside
          </motion.h2>
        </div>

        {/* 2. INTERACTIVE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((item, index) => (
            <motion.div
              key={index}
              /* 7. PAGE LOAD FLIP ANIMATION */
              initial={{ rotateY: 90, opacity: 0 }}
              whileInView={{ rotateY: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="group relative flex flex-col h-[500px] cursor-pointer overflow-hidden"
            >
              {/* IMAGE CONTAINER */}
              <div className="flex-grow overflow-hidden relative">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* SLIDE DOWN OVERLAY (Top to Bottom) */}
                <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 text-center translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-20 text-justify">
                  {/* <h4 className="text-white text-xl font-serif mb-4 border-b border-white/30 pb-2">
                    {item.title}
                  </h4> */}
                  <p className="text-white text-[14px] leading-relaxed CadillacGothic-Regular">
                    {item.desc}
                  </p>
                  {/* <button className="mt-6 text-xs tracking-widest text-white border border-white/40 px-6 py-2 hover:bg-white hover:text-black transition-colors">
                    LEARN MORE
                  </button> */}
                </div>
              </div>

              {/* 3. BOTTOM LABEL (Blue background as per image) */}
              <div className="bg-[#28659b] py-4 text-center z-10">
                <h3 className="text-white text-[14px] font-bold tracking-[0.2em] CadillacGothic-Regular">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Residentailmix;