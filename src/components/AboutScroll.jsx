import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom'; // Added missing import

const AboutScroll = () => {
  const container = useRef(null);

  const headingText = "Developing Spaces Designed for People, Purpose, and Progress";
  const descriptionText = "Ameya Group is a Gurugram-based real estate developer known for creating vibrant commercial and retail destinations that become an integral part of everyday urban life. With a deep understanding of how businesses, communities, and locations come together, Ameya focuses on developing thoughtfully planned neighbourhood bazaars and commercial hubs across the city’s most promising growth corridors.";

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start center", "end center"], // Faster trigger
  });

  const words = headingText.split(" ");

  return (
    <section ref={container} className="relative h-[120vh] bg-[#F9F9F9] z-10">
      
      {/* Centered Sticky Wrapper */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        
        <div className="max-w-5xl w-full text-center">
          {/* Subtitle */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="text-[10px] md:text-sm font-bold tracking-[0.4em] text-black uppercase flex items-center justify-center CadillacGothic-Regular">
              <span className="mr-3">✦</span> ABOUT AMEYA GROUP
            </span>
          </motion.div>

          {/* Rapid Reveal Heading */}
          <h2 className="flex flex-wrap justify-center text-[30px] md:text-[42px] font-semibold leading-[1.2] tracking-tight text-center mb-10 CadillacGothic-WideRegular">
            {words.map((word, i) => (
              <Word 
                key={i} 
                word={word} 
                index={i} 
                totalWords={words.length} 
                progress={scrollYProgress} 
              />
            ))}
          </h2>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-3xl mx-auto text-[15px] md:text-[16px] text-[#000] font-light leading-[1.5] CadillacGothic-Regular"
          >
            {descriptionText}
          </motion.p>

          {/* Read More Button - Now correctly placed inside return */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12"
          >
            <Link to="/about" className="ar-about-btn">
              <span className="btn-text">Read Our Story</span>
              <span className="btn-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <div className="btn-background"></div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Word = ({ word, progress, index, totalWords }) => {
  const characters = word.split("");
  
  // Speed up: lowered duration multiplier to 0.15
  const revealSpeed = 0.4;
  const start = (index / totalWords) * revealSpeed;
  const end = start + (1 / totalWords) * revealSpeed;

  return (
    <span className="inline-block mr-[0.25em] whitespace-nowrap">
      {characters.map((char, i) => {
        const charStart = start + (i / characters.length) * (end - start);
        const charEnd = charStart + (1 / characters.length) * (end - start);
        
        return (
          <Character key={i} range={[charStart, charEnd]} progress={progress}>
            {char}
          </Character>
        );
      })}
    </span>
  );
};

const Character = ({ children, range, progress }) => {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [2, 0]);

  return (
    <motion.span style={{ opacity, y }} className="inline-block text-black">
      {children}
    </motion.span>
  );
};

export default AboutScroll;