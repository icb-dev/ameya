import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import rlogo from "../assets/images/residencelogo.png";
import clogo from "../assets/images/sapphirelogo.png"; 
import fr from "../assets/images/fr.png";
import fc from "../assets/images/fc.png";

const Homefeatured = () => {
  const [projects, setProjects] = useState([
    {
      // id: 1,
      // title: "Sapphire Residences",
      // logo: rlogo,
      // description: "A premium ultra luxury high rise residential apartments located in the Heart of Gurgaon",
      // highlights: ["Infinity Pool", "Private Sky Lounge", "Concierge Service"],
      // image: fr
    },
    {
      // id: 2,
      // title: "Sapphire 57",
      // logo: clogo,
      // description: "Sapphire 57 is a vibrant neighbourhood bazaar in Sector 57 offering everyday convenience, dining, and lifestyle experiences.",
      // highlights: ["Leed Certified", "High-speed Elevators", "Smart Parking"],
      // image: fc
    }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/projects/featured`);
        const data = await response.json();
        
        console.log('Fetched featured projects:', data);
        
        if (data && data.length > 0) {
          const formattedProjects = data.map(project => {
            let description = "";
            
            // Parse the overview JSON string to get description
            try {
              if (project.overview) {
                const overview = JSON.parse(project.overview);
                let fullDescription = overview.description || "";
                
                // Limit to 50 words
                const words = fullDescription.trim().split(/\s+/).filter(word => word.length > 0);
                if (words.length > 50) {
                  description = words.slice(0, 20).join(' ') + '...';
                } else {
                  description = fullDescription;
                }
              }
            } catch (e) {
              console.error('Error parsing overview:', e);
            }
            
            return {
              id: project.id,
              title: project.project_name,
              logo: project.project_logo,
              image: project.project_thumbnail,
              description: description,
              highlights: []
            };
          });
          
          setProjects(formattedProjects);
        }
      } catch (error) {
        console.error('Error fetching featured projects:', error);
      }
    };

    fetchFeaturedProjects();
  }, []);

  const current = projects[currentIndex];

  const next = () => setCurrentIndex((prev) => (prev + 1) % projects.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);

  return (
    <section className="relative w-full  bg-[#f1f8ff] flex flex-col lg:flex-row overflow-hidden">
      
      {/* 1. LEFT SIDE: FULL HEIGHT IMAGE (50%) */}
      <div className="w-full lg:w-[50%] h-[50vh] md:h-[70vh] lg:h-[100vh] relative overflow-hidden group cursor-pointer">
        <AnimatePresence mode="wait">
          <motion.img
            key={current.id}
            src={current.image}
            alt={current.title}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-1000 shadow-inner" />
      </div>

      {/* 2. RIGHT SIDE: CONTENT SECTION (50%) */}
      <div className="w-full lg:w-[50%] h-[50vh] md:h-[70vh] lg:h-[100vh] flex flex-col justify-between bg-[#f1f8ff] text-white p-8 md:p-16 lg:p-12 text-center md:text-center lg:text-left xl:text-left">
        
        {/* STATIC TOP HEADING */}
        <div className="mb-8 lg:mb-8 xl:mb-12">
          <h2 className="text-3xl md:text-[38px] lg:text-[36px] xl:text-[48px] font-light tracking-tight leading-[1.2] text-black PlayfairDisplay">
            Featured Developments<br /> by Ameya Group 
          </h2>
        </div>

        {/* DYNAMIC CONTENT AREA */}
        <div className="flex-grow flex flex-col justify-end md:justify-center lg:justify-end xl:justify-end">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* LOGO ADDED HERE */}
              {current.logo && (
                <div className="mb-6 flex justify-center md:justify-center lg:justify-start xl:justify-start">
                  <img 
                    src={current.logo} 
                    alt={`${current.title} Logo`} 
                    className="h-22 md:h-22 lg:h-26 xl:h-36 w-auto object-contain object-left mb-6 md:mb-6 lg:mb-8 xl:mb-8"
                  />
                </div>
              )}

              <p className="text-[#28659b] text-xs md:text-sm tracking-[1.2px] uppercase mb-2 md:mb-1 lg:mb-2 font-bold CadillacGothic-Regular">
                {current.category}
              </p>
              <h3 className="text-[24px] md:text-3xl lg:text-[26px] xl:text-[36px] mb-2 leading-tight text-black CadillacGothic-NarrowRegular">
                {current.title}
              </h3>
              <p className="text-black text-[14px] tracking-[0px] md:text-[14px] lg:text-[14px] xl:text-[15px] font-light leading-[1.2] md:leading-relaxed max-w-[80%] mb-8 antialiased CadillacGothic-Regular max-w-[100%] lg:max-w-full xl:max-w-[80%]">
                {current.description}
              </p>
              
              {/* <div className="flex flex-wrap gap-3 mb-10">
                {current.highlights.map((tag, i) => (
                  <span key={i} className="text-[10px] uppercase tracking-widest border border-gray-800 px-3 py-1 text-black CadillacGothic-Regular">
                    {tag}
                  </span>
                ))}
              </div> */}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* NAVIGATION CONTROLS */}
        <div className="flex items-center  justify-center md:justify-center lg:justify-start xl:justify-start gap-8 mt-auto pt-8 border-t border-[#9d2a2a]">
          <div className="flex gap-4">
            <button 
              onClick={prev}
              className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center hover:bg-[#28659b] transition-all duration-500 group md:w-11 md:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22px" fill="#000" viewBox="0 0 24 24">
                <path d="m8.732,13.768c-.472-.473-.732-1.101-.732-1.768s.26-1.295.734-1.77L18.026.852c.194-.196.193-.513-.003-.707-.197-.194-.513-.192-.707.004l-9.291,9.377c-.661.661-1.025,1.54-1.025,2.475s.364,1.813,1.024,2.473l9.292,9.379c.098.099.226.148.355.148.127,0,.254-.048.352-.145.196-.194.197-.511.003-.707l-9.294-9.381Z"/>
              </svg>
            </button>
            <button 
              onClick={next}
              className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center hover:bg-[#28659b] transition-all duration-500 group md:w-11 md:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22px" fill="#000" viewBox="0 0 24 24">
                <path d="m17,12c0,.935-.364,1.813-1.025,2.475l-9.291,9.377c-.098.099-.227.148-.355.148-.127,0-.255-.048-.352-.145-.196-.194-.198-.511-.004-.707l9.293-9.379c.475-.475.734-1.103.734-1.77s-.26-1.295-.732-1.768L5.973.852c-.194-.196-.192-.513.004-.707.195-.195.513-.191.707.004l9.293,9.379c.659.659,1.023,1.538,1.023,2.473Z"/>
              </svg>
            </button>
          </div>
          
          {/* <div className="text-xs tracking-[0.3em] text-black uppercase CadillacGothic-Regular">
            Project <span className="text-[#9d2a2a]">0{currentIndex + 1}</span> / 0{PROJECTS.length}
          </div> */}
        </div>

      </div>
    </section>
  );
};

export default Homefeatured;