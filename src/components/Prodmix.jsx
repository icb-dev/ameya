import React from 'react';
import { motion } from 'framer-motion';

const Prodmix = ({ mixSection }) => {
  const defaultCategories = [
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

  // Map API data to component format
  const categories = mixSection && mixSection.items && Array.isArray(mixSection.items)
    ? mixSection.items.map(item => ({
        title: item.title?.toUpperCase() || "ITEM",
        img: item.image || defaultCategories[0].img,
        desc: item.description || item.title || ""
      }))
    : defaultCategories;

  return (
    <section className="py-16 md:py-24 px-6 md:px-16 xl:px-36 bg-white overflow-hidden">
      <div className="max-w-[1450px] mx-auto">
        
        {/* 1. SECTION TITLE */}
        <div className="flex flex-col items-center justify-center mb-10 md:mb-16">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-8 md:w-12 h-[2px] bg-red-800" />
            <span className="text-[12px] md:text-[14px] font-bold tracking-[0.3em] md:tracking-[0.5em] text-gray-800 CadillacGothic-Regular uppercase">
            </span>
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="xs:text-[18px] text-[26px] md:text-[34px] lg:text-[32px] xl:text-[48px] font-serif text-black PlayfairDisplay text-center"
          >
          The MIX Use
          </motion.h2>
        </div>

        {/* 2. INTERACTIVE FLEX CONTAINER (Centers 1, 2, or 3 items) */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {categories.map((item, index) => (
            <motion.div
              key={index}
              initial={{ rotateY: 90, opacity: 0 }}
              whileInView={{ rotateY: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              /* width: full on mobile, nearly half on sm, and fixed 1/4th-ish on lg */
              className="group relative flex flex-col h-[400px] md:h-[450px] lg:h-[500px] cursor-pointer overflow-hidden w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
            >
              {/* IMAGE CONTAINER */}
              <div className="flex-grow overflow-hidden relative">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* SLIDE DOWN OVERLAY */}
                <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-20">
                  <p className="text-white text-[13px] md:text-[14px] leading-relaxed CadillacGothic-Regular  text-left">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* 3. BOTTOM LABEL */}
              <div className="bg-[#28659b] py-4 md:py-5 text-center z-10">
                <h3 className="text-white text-[12px] md:text-[14px] font-bold tracking-[0.1em] md:tracking-[0.2em] CadillacGothic-Regular uppercase px-2">
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

export default Prodmix;