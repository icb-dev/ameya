import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// IMPORT YOUR LOGO HERE
import SapphireLogo from '../assets/images/sapphirelogo.png'; 
import sapphirefeatured from '../assets/images/sapphirefeatured.jpg'; 
// const SapphireLogo = "https://cdn-icons-png.flaticon.com/512/2111/2111432.png"; // Placeholder

const Sapphire = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 30,
    damping: 20,
    restDelta: 0.001
  });

  // RESPONSIVE TRANSFORMS
  const imgY = useTransform(smoothProgress, [0.1, 0.7], ["100vh", "0vh"]);
  const imgWidth = useTransform(
    smoothProgress, 
    [0.1, 0.7], 
    [window.innerWidth < 768 ? "90%" : "65%", "100%"]
  );
  const imgRadius = useTransform(smoothProgress, [0.5, 0.7], ["20px", "0px"]);

  // TEXT COLOR LOGIC
  const textColor = useTransform(smoothProgress, [0.5, 0.7], ["#000000", "#FFFFFF"]);
  
  // LOGO FILTER LOGIC
  // "none" keeps the default colors
  // "brightness(0) invert(1)" turns any color into pure white
  const logoFilter = useTransform(
    smoothProgress, 
    [0.5, 0.7], 
    ["brightness(1) invert(0)", "brightness(0) invert(1)"]
  );

  // Button Reveal
  const btnOpacity = useTransform(smoothProgress, [0.8, 0.95], [0, 1]);
  const btnY = useTransform(smoothProgress, [0.8, 0.95], [20, 0]);

  return (
    <section ref={containerRef} className="relative h-[350vh] bg-white">
      
      {/* THE STICKY VIEWPORT */}
      <div className="sticky top-0 h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* CONTENT BLOCK */}
        <motion.div 
          style={{ color: textColor }}
          className="relative z-20 text-center px-6 max-w-6xl flex flex-col items-center justify-center"
        >
          {/* LOGO CONTAINER - Circle removed, size increased */}
          <motion.div 
            className="mb-8 md:mb-10 flex items-center justify-center overflow-hidden"
            /* ADJUST LOGO SIZE HERE:
               Change w-24 (96px) or w-32 (128px) to your preferred width.
            */
            style={{ width: window.innerWidth < 768 ? '100px' : '280px' }} 
          >
            <motion.img 
              src={SapphireLogo} 
              alt="Sapphire Logo"
              style={{ filter: logoFilter }}
              className="w-full h-auto object-contain transition-all duration-300"
            />
          </motion.div>

          {/* Title */}
          <h2 className="text-4xl md:text-8xl lg:text-7xl font-serif tracking-relaxed mb-6 quarto leading-tight">
            Sapphire – A Signature Retail Asset
          </h2>
          
          {/* Description */}
          <p className="text-[13px] md:text-lg font-light leading-relaxed max-w-md md:max-w-[75%] mx-auto tracking-[0.05em] antialiased opacity-90 CadillacGothic-Regular">
            Ameya Group’s Sapphire projects are built around location strength, everyday demand, and sustainable rental potential.
          </p>

          {/* BUTTON */}
          <motion.div style={{ opacity: btnOpacity, y: btnY }} className="mt-8 md:mt-12">
            <button className="group relative overflow-hidden px-10 py-4 bg-white text-black text-[10px] tracking-[0.3em] uppercase font-bold shadow-2xl transition-transform active:scale-95">
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white Ameyasans-WideMedium">Explore the Chain</span>
              {/* The Background Slide - slides up on hover */}
  <div className="absolute inset-0 bg-[#28659b] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
            </button>
          </motion.div>
        </motion.div>

        {/* THE RISING IMAGE */}
        <motion.div
          style={{ 
            y: imgY,
            width: imgWidth,
            borderRadius: imgRadius,
          }}
          className="absolute z-10 h-full w-full overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)] origin-bottom"
        >
          <img 
            src={sapphirefeatured} 
            className="w-full h-full object-cover"
            alt="Sapphire Backdrop"
          />
          
          <motion.div 
            style={{ opacity: useTransform(smoothProgress, [0.5, 0.7], [0, 0.5]) }}
            className="absolute inset-0 bg-black/60"
          />
        </motion.div>

      </div>
    </section>
  );
};

export default Sapphire;