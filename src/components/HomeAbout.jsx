import { motion } from 'framer-motion'; 
import AllLogo from "../assets/images/sapphireinfographic.png";

const HomeAbout = () => {
  return (
    <section className="w-full bg-white py-20 md:py-32 overflow-hidden h-auto">
      <div className="max-w-[1450px] mx-auto px-6 md:px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: CONTENT (60%) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-[50%] space-y-8"
          >
            <div className="space-y-4">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "80px" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-[2px] bg-[#9d2a2a]"
              />
              <span className="block text-[#28659b] text-[12px] tracking-[0.4em] uppercase font-bold CadillacGothic-Regular">
                Overview
              </span>
              <h2 className="xs:text-[18px] text-[26px] md:text-[34px] lg:text-[32px] xl:text-[48px] text-black leading-tight tracking-tight PlayfairDisplay">
                Sapphire — A Trusted Chain of<br /> 
                <span className="text-[#28659b]">Neighbourhood Bazaars</span>
              </h2>
            </div>

            <p className="text-[13px] md:text-[14px] text-[#000] font-light leading-[1.6] CadillacGothic-Regular max-w-2xl">
            The Sapphire journey began in 2009 with the launch of The Sapphire in Sector 49 — a pioneering development that redefined neighbourhood destinations for modern communities. Its success laid the foundation for the first-ever curated chain of Neighbourhood Bazaars by Ameya Group.
The vision soon expanded into a growing portfolio including Sapphire 83, Sapphire 90, Sapphire57, and several other landmark developments, each designed as vibrant hubs within high-growth locations.
Guided by foresight and design excellence, Ameya Group continues to create destinations that blend convenience, aspiration, and long-term value.
            </p>
            <p className="text-[13px] md:text-[14px] text-[#000] font-light leading-[1.6] CadillacGothic-Regular max-w-full">
              
            </p>

            {/* INTERACTIVE BUTTON */}
         <motion.a
  href="/About-us" // Link to the about page
    // Optional: opens in new tab
  rel="noopener noreferrer"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="relative overflow-hidden group bg-[#28659b] text-white xl:px-10 xl:py-5 rounded-full w-fit shadow-xl shadow-[#28659b]/20 transition-all duration-500 lg:px-4 lg:py-2 md:px-4 md:py-2 px-6 py-2 flex items-center justify-center cursor-pointer no-underline"
>
  {/* Darker Background Slide Effect */}
  <motion.div 
    className="absolute inset-0 bg-[#1a4369] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out"
  />
  
  <span className="relative z-10 text-[11px] md:text-[13px] font-bold uppercase tracking-[0.1em] CadillacGothic-WideRegular lg:tracking-[0.1em] md:tracking-[0.1em]">
    Discover Our Story
  </span>
</motion.a>
          </motion.div>
        
          {/* RIGHT COLUMN: IMAGE (40%) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full lg:w-[50%] relative"
          >
            {/* Decorative element behind image - adjusted to 40% column context */}
            <div className="absolute -top-4 -right-4 w-full h-full border border-gray-100 rounded-[0px] z-0" />
            
            <div className="relative z-10 aspect-[4/5] md:aspect-[4/4] overflow-hidden rounded-[0px] shadow-1xl">
              <motion.img  
                src={AllLogo} 
                alt="Ameya Architecture" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HomeAbout;