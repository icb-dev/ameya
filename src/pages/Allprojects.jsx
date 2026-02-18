import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getProjects } from "../../services/projectService";
import ContactCTA from "../components/ContactCTA";

// Assets
import homthumbnail from "../assets/images/homthumbnail.png";
import residencelogo1 from "../assets/images/residencelogo1.png";
import bannerBg from "../assets/images/shaphirebnrbg.png"; 

// Additional Banner Images for Slider
import ctabg2 from "../assets/images/thesapphireimg.jpg";
import ctabg3 from "../assets/images/saphire93img.jpg";

const BANNER_IMAGES = [bannerBg, ctabg2, ctabg3];

const Allprojects = () => {
  const [activeTab, setActiveTab] = useState("Ongoing");
  const [currentImg, setCurrentImg] = useState(0);
  const [allProjects, setAllProjects] = useState({
    Ongoing: [],
    Completed: [],
  });
  const [loading, setLoading] = useState(true);

  // Banner Slider Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const apiData = await getProjects();
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
            projectType: p.project_type,
          };

          if (p.status === "ongoing") {
            mappedProjects.Ongoing.push(project);
          } else if (p.status === "completed") {
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
    <div className="w-full bg-white">
      {/* SECTION 1: BREADCRUMB BANNER (UPDATED FORMATTING) */}
      <section className="relative h-[50vh] md:h-[65vh] flex items-end overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={currentImg}
              src={BANNER_IMAGES[currentImg]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover" 
              alt="Project Background"
            />
          </AnimatePresence>
          {/* Static Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/0 to-black/80 z-[5]" />
        </div>

        <div className="relative z-10 w-full max-w-[1450px] mx-auto px-6 md:px-6 pb-12 md:pb-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start"
          >
            <h1 className="text-white text-3xl md:text-[48px] font-serif PlayfairDisplay mb-4">
              Our Portfolio
            </h1>
            
            <div className="flex items-center gap-2 text-white/70 text-[10px] md:text-[11px] uppercase tracking-[0.3em] CadillacGothic-Regular">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white font-bold">All Projects</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: TABBED PROJECT LISTING */}
      <section className="bg-white py-20 md:py-32 px-6 md:px-12">
        <div className="max-w-[1450px] mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-[38px] lg:text-[48px] tracking-tight font-serif text-[#000000] mb-8 PlayfairDisplay">
              Ameya Group Projects
            </h2>

            <div className="flex justify-center gap-8 border-b border-gray-100 max-w-fit mx-auto">
              {['Ongoing', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-[11px] md:text-sm tracking-[0.2em] uppercase transition-all relative CadillacGothic-Regular ${
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

          <div className="relative">
            {loading ? (
              <div className="text-center py-20 text-gray-500 CadillacGothic-Regular tracking-widest uppercase text-xs">Loading Architecture...</div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20 lg:gap-y-24"
                >
                  {allProjects[activeTab].length > 0 ? (
                    allProjects[activeTab].map((project) => (
                      <ProjectCard key={project.id} project={project} projectType={project.projectType} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20 text-gray-400 CadillacGothic-Regular uppercase text-sm tracking-widest">
                      No Projects Listed in this category.
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: CONTACT CTA */}
      <ContactCTA />
    </div>
  );
};

/* REUSABLE PROJECT CARD */
const ProjectCard = ({ project, projectType = 'commercial' }) => {
  const detailRoute = `/projects/${project.slug}`;

  return (
    <div className="flex flex-col group cursor-pointer w-full">
      <div className="relative aspect-[4/5] overflow-hidden mb-8">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-start p-8">
          <div className="w-3/4 max-w-[160px] md:max-w-[120px] lg:max-w-[140px] xl:max-w-[240px] h-auto flex items-center justify-start drop-shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-2 mt-12">
            <img 
               src={project.logo} 
               alt={`${project.title} logo`}
               className="w-full h-full object-contain" 
            />
          </div>
        </div>
      </div>

      <div className="text-center px-4 flex flex-col items-center">
        <h4 className="text-[32px] md:text-[26px] lg:text-[22px] xl:text-[28px] font-bold tracking-[0.2px] text-[#1a1a1a] mb-2 PlayfairDisplay leading-tight">
          {project.title}
        </h4>
        <p className="text-[12px] md:text-[12px] lg:text-[12px] xl:text-[14px] text-black mb-4 tracking-relaxed CadillacGothic-Regular uppercase font-light">
          {project.location}
        </p>
        
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

export default Allprojects;