import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { getProjects } from "../../services/projectService";

 
import sapphirefeatured from "../assets/images/sapphirefeatured.jpg";
import sapphirelogo from "../assets/images/sapphirelogo.png";

import saphire90img from "../assets/images/saphire90img.webp";
import saphire90logo from "../assets/images/saphire90logo.png";

import saphire93img from "../assets/images/saphire93img.jpg";
import saphire93logo from "../assets/images/saphire93logo.png";

import thesapphireimg from "../assets/images/thesapphireimg.jpg";
import ameyalogo from "../assets/logo/ameya-logo.png";

import ameyaoneimg from "../assets/images/ameyaoneimg.jpg";
import homthumbnail from "../assets/images/homthumbnail.png";

import residencelogo1 from "../assets/images/residencelogo1.png";

import 'swiper/css';
import 'swiper/css/navigation';

const Homeprojects = () => {
  const [activeTab, setActiveTab] = useState("Ongoing");
  const [allProjects, setAllProjects] = useState({
    Ongoing: [],
    Completed: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const apiData = await getProjects(); // backend only

        const mappedProjects = {
          Ongoing: [],
          Completed: [],
        };

        apiData.forEach((p) => {
          if (!p.status || !p.project_type) return;

          const project = {
            id: p.id,
            title: p.project_name,
            subtitle: p.project_name?.toUpperCase(),
            location: `${p.sector}, ${p.city}`,
            logo: p.project_logo || residencelogo1,
            image: p.project_thumbnail || homthumbnail,
            featured: p.status === "ongoing",
            slug: p.slug,
            projectType: p.project_type, // Store project type for routing
          };

          // Add all projects (both residential and commercial) to the appropriate status
          if (p.status === "ongoing") {
            mappedProjects.Ongoing.push(project);
          }
          if (p.status === "completed") {
            mappedProjects.Completed.push(project);
          }
        });

        setAllProjects(mappedProjects);
      } catch (error) {
        console.error("Failed to load projects from backend", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  

  return (
    <section className="bg-white pt-20 md:pt-22 lg:pt-32 xl:pt-40 pb-20  px-6 md:px-12">
      {/* ALL PROJECTS SECTION */}
      <div className="text-center mb-6 md:mb-2 lg:mb-16 xl:mb-16">
        <h2 className="text-4xl md:text-[38px] lg:text-[38px] xl:text-[48px] tracking-tight font-serif text-[#000000] mb-8 PlayfairDisplay">
          Ameya Group Projects
        </h2>

        <div className="flex justify-center gap-8 border-b border-gray-100 max-w-fit mx-auto mb-12">
          {['Ongoing', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm tracking-widest uppercase transition-all relative CadillacGothic-Regular ${
                activeTab === tab ? 'text-black font-bold' : 'text-gray-400'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading projects...</div>
        ) : allProjects[activeTab].length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <Swiper
                  modules={[Autoplay, Navigation]}
                  spaceBetween={30}
                  slidesPerView={1}
                  centerInsufficientSlides={true}
                  loop={allProjects[activeTab].length > 1}
                  autoplay={{ 
                    delay: 5000, 
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true 
                  }}
                  navigation={{
                    nextEl: '.next-btn',
                    prevEl: '.prev-btn',
                  }}
                  breakpoints={{
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                  }}
                >
                  {allProjects[activeTab].map((project) => (
                    <SwiperSlide key={project.id}>
                      <ProjectCard project={project} projectType={project.projectType} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-2 md:gap-10 lg:gap-10 xl:gap-10 mt-16">
              <button className={`prev-btn group w-11 h-11 md:w-14 md:h-14 border border-black/50 rounded-full flex items-center justify-center hover:bg-[#28659b] hover:border-[#28659b] transition-all duration-300 cursor-pointer ${allProjects[activeTab].length <= 1 ? 'opacity-20 pointer-events-none' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" className="fill-black group-hover:fill-white transition-colors duration-300" viewBox="0 0 24 24">
                  <path d="m8.732,13.768c-.472-.473-.732-1.101-.732-1.768s.26-1.295.734-1.77L18.026.852c.194-.196.193-.513-.003-.707-.197-.194-.513-.192-.707.004l-9.291,9.377c-.661.661-1.025,1.54-1.025,2.475s.364,1.813,1.024,2.473l9.292,9.379c.098.099.226.148.355.148.127,0,.254-.048.352-.145.196-.194.197-.511.003-.707l-9.294-9.381Z"/>
                </svg>
              </button>
              
              <Link to={`/Allprojects`} className="ar-about-btn">
                <span className="btn-text">View all projects</span>
                <span className="btn-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div className="btn-background"></div>
              </Link>

              <button className={`next-btn group w-11 h-11 md:w-14 md:h-14 border border-black/50 rounded-full flex items-center justify-center hover:bg-[#28659b] hover:border-[#28659b] transition-all duration-300 cursor-pointer ${allProjects[activeTab].length <= 1 ? 'opacity-20 pointer-events-none' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" className="fill-black group-hover:fill-white transition-colors duration-300" viewBox="0 0 24 24">
                  <path d="m17,12c0,.935-.364,1.813-1.025,2.475l-9.291,9.377c-.098.099-.227.148-.355.148-.127,0-.255-.048-.352-.145-.196-.194-.198-.511-.004-.707l9.293-9.379c.475-.475.734-1.103.734-1.77s-.26-1.295-.732-1.768L5.973.852c-.194-.196-.192-.513.004-.707.195-.195.513-.191.707.004l9.293,9.379c.659.659,1.023,1.538,1.023,2.473Z"/>
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-600">
            No projects found.
          </div>
        )}
      </div>
    </section>
  );
};

const ProjectCard = ({ project, projectType = 'commercial' }) => {
  // Determine the route based on project type
  const detailRoute = projectType === 'commercial' 
    ? `/projects/${project.slug}` 
    : `/projects/${project.slug}`; // Residential also uses /projects/:slug route

  return (
    <div className="flex flex-col group cursor-pointer w-full">
      {/* Thumbnail Area */}
      <div className="relative aspect-[4/5] overflow-hidden mb-8">
        {/* {project.featured && (
          <div className="absolute top-6 left-6 z-20 bg-[#28659b] text-white text-[9px] font-bold px-4 py-1.5 uppercase tracking-[0.2em] CadillacGothic-Bold">
            Available
          </div>
        )} */}

        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />
        
        <div className="absolute inset-0    transition-all duration-700" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          {/* Logo Animation */}
          <div className="w-3/4 max-w-[160px] md:max-w-[120px] lg:max-w-[140px] xl:max-w-[240px] h-auto flex items-center justify-center drop-shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-2 ">
            <img 
               src={project.logo} 
               alt={`${project.title} logo`}
               className="w-full h-full object-contain  " 
            />
          </div>
          {/* Subtitle Animation */}
          <p className="text-[11px] tracking-[0.6em] mt-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 uppercase CadillacGothic-Regular text-white mb-48 md:mb-48 lg:mb-32 xl:mb-48">
            {project.subtitle}
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="text-center px-4 flex flex-col items-center">
        <h4 className="text-[32px] md:text-[26px] lg:text-[22px] xl:text-[28px] font-bold tracking-[0.2px] text-[#1a1a1a] mb-2 PlayfairDisplay leading-tight">
          {project.title}
        </h4>
        <p className="text-[12px] md:text-[12px] lg:text-[12px] xl:text-[14px] text-black mb-4 tracking-relaxed CadillacGothic-Regular uppercase font-light">
          {project.location}
        </p>
        
        {/* Explore Details Button */}
        <Link to={detailRoute}>
        <button className="relative group/btn overflow-hidden text-[10px] md:text-[10px] lg:text-[10px] xl:text-[12px] font-bold uppercase tracking-[0.1em] md:tracking-[0.1em] lg:tracking-[0.1em] xl:tracking-[0.2em] px-6 py-2 border border-black/50 hover:border-black transition-all duration-500 CadillacGothic-Bold w-fit cursor-pointer"> 
         <span className="relative z-10 transition-colors duration-500 group-hover/btn:text-white CadillacGothic-Regular font-black">
          Explore Details
          </span> 
          <span className="absolute inset-0 bg-[#28659b] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></span>
        </button>
        </Link> 
      </div>
    </div>
  );
};

export default Homeprojects;