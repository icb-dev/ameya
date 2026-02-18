import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getProjects } from '../../services/projectService';
import ContactCTA from "../components/ContactCTA";
import ProjectApproach from "../components/ProjectApproach.jsx";

// Asset Imports - Banner Images
import ctabg1 from "../assets/images/ctabg1.png";
import ctabg2 from "../assets/images/ctabg2.png";
import ctabg3 from "../assets/images/ctabg3.png";
import ctabg4 from "../assets/images/ctabg4.png";

// Asset Imports - Project Thumbnails & Logos
import homthumbnail from "../assets/images/homthumbnail.png"; 
import residencelogo1 from "../assets/images/residencelogo1.png";

const BANNER_IMAGES = [ctabg1, ctabg2, ctabg3, ctabg4]; 

const Allcommercialprojects = () => {
  const [activeTab, setActiveTab] = useState('Ongoing');
  const [displayLimit, setDisplayLimit] = useState(6);
  const [currentImg, setCurrentImg] = useState(0);
  const [projectData, setProjectData] = useState({ Ongoing: [], Completed: [] });
  const [loading, setLoading] = useState(true);

  // Fetch commercial projects from API
  useEffect(() => {
    const fetchCommercialProjects = async () => {
      try {
        const apiData = await getProjects();
        
        // Filter only commercial projects and map to component format
        const mapped = {
          Ongoing: [],
          Completed: []
        };

        apiData.forEach((p) => {
          // Only process commercial projects
          if (p.project_type !== 'commercial' || !p.status) return;

          const project = {
            id: p.id,
            slug: p.slug,
            title: p.project_name,
            subtitle: p.project_name?.toUpperCase(),
            location: `${p.sector}, ${p.city}`,
            logo: p.project_logo || residencelogo1,
            image: p.project_thumbnail || homthumbnail,
          };

          if (p.status === 'ongoing') {
            mapped.Ongoing.push(project);
          } else if (p.status === 'completed') {
            mapped.Completed.push(project);
          }
        });

        setProjectData(mapped);
      } catch (error) {
        console.error("Failed to load commercial projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommercialProjects();
  }, []);

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredProjects = projectData[activeTab] || [];
  const hasMore = displayLimit < filteredProjects.length;

  return (
    <div className="bg-white min-h-screen">
      
      {/* BANNER SECTION - FIXED CROSSFADE */}
      <section className="relative h-[50vh] md:h-[65vh] flex items-end overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          {/* We remove mode="wait" so images overlap during transition */}
          <AnimatePresence>
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
              Commercial Projects
            </h1>
            
            <div className="flex items-center gap-2 text-white/70 text-[10px] md:text-[11px] uppercase tracking-[0.3em] CadillacGothic-Regular">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">Commercial Projects</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TABS SECTION */}
      <section className="pt-24 pb-12 px-6 text-center max-w-4xl mx-auto">
        <h2 className="xs:text-[18px] text-[26px] md:text-[34px] lg:text-[38px] xl:text-[48px] font-serif PlayfairDisplay text-black mb-6 tracking-tight">
          Ameya Commercial Projects
        </h2>
        <p className="text-black CadillacGothic-Regular text-[14px] md:text-[16px] max-w-2xl mx-auto leading-relaxed">
          Explore our diverse portfolio of landmark developments that stand as a testament to innovation and architectural excellence.
        </p>
      </section>

      {/* SLIDE-IN TABS */}
      <div className="flex justify-center mb-20">
        <div className="flex bg-[#dbdad6] p-1.5 rounded-full relative">
          {['Ongoing', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setDisplayLimit(6); }}
              className={`relative px-10 py-3 text-[12px] md:text-[14px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] z-10 transition-colors duration-500 CadillacGothic-Regular ${
                activeTab === tab ? 'text-white' : 'text-black hover:text-black'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTabBg" 
                  className="absolute inset-0 bg-[#28659b] rounded-full -z-10 shadow-lg" 
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* PROJECTS GRID */}
      <div className="max-w-[1450px] mx-auto px-6 md:px-12 pb-32">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-[#28659b] border-t-transparent" />
            <p className="mt-4 text-gray-600">Loading commercial projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">No {activeTab.toLowerCase()} commercial projects found.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8"
            >
              {filteredProjects.slice(0, displayLimit).map((project, index) => (
                <ProjectThumbnail key={project.id} project={project} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* LOAD MORE */}
        {hasMore && (
          <div className="mt-20 text-center">
            <button 
              onClick={() => setDisplayLimit(prev => prev + 3)} 
              className="group relative px-12 py-4 border border-black/20 hover:border-[#28659b] overflow-hidden transition-all duration-500"
            >
              <span className="relative z-10 text-[12px] uppercase tracking-[0.3em] font-bold CadillacGothic-Bold group-hover:text-[#28659b]">
                Load More Projects
              </span>
            </button>
          </div>
        )}
      </div>

      <ProjectApproach />

      {/* SECTION 3: CONTACT CTA */}
      <ContactCTA /> 

    </div> 
  );
};



const ProjectThumbnail = ({ project, index }) => {
  return (
    <motion.div
      variants={{ hidden: { rotateY: 90, opacity: 0 }, visible: { rotateY: 0, opacity: 1 } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className="flex flex-col group cursor-pointer w-full"
    >
      {/* Thumbnail Image and Logo Overlay */}
      <div className="relative aspect-[4/5] overflow-hidden mb-8 shadow-xl rounded-sm">
        <img 
          src={project.image} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          alt={project.title} 
        />
        {/* Blue Tint Hover Overlay */}
        <div className="absolute   transition-all duration-700" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          {/* Logo */}
          <div className="w-3/4 max-w-[200px] h-auto flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-4">
            <img src={project.logo} className="w-full h-full object-contain  " alt="logo" />
          </div>
          {/* Subtitle */}
          <p className="text-[10px] tracking-[0.6em] mt-8 mb-44 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 uppercase CadillacGothic-Regular text-white">
            {project.subtitle}
          </p>
        </div>
      </div>

      {/* Project Details */}
      <div className="text-center px-4 flex flex-col items-center">
        <h4 className="text-[32px] md:text-[26px] lg:text-[22px] xl:text-[28px] font-bold text-black mb-2 PlayfairDisplay tracking-tight">
          {project.title}
        </h4>
        <p className="text-[12px] md:text-[12px] lg:text-[12px] xl:text-[14px] text-black CadillacGothic-Regular uppercase tracking-[0.1em]">
          {project.location}
        </p>
        
        {/* Red Center Divider */}
        <div className="w-12 h-[2px] bg-red-600 my-6 mx-auto" />
        
        {/* Explore Button */}
        <Link to={`/projects/${project.slug}`} className="cursor-pointer">
        <button className="relative group/btn overflow-hidden text-[10px] md:text-[10px] lg:text-[10px] xl:text-[12px] font-bold uppercase tracking-[0.1em] md:tracking-[0.1em] lg:tracking-[0.1em] xl:tracking-[0.2em] px-8 py-2.5 border border-black/50 hover:border-black transition-all duration-500 CadillacGothic-Bold cursor-pointer"> 
          <span className="relative z-10 group-hover/btn:text-white transition-colors duration-500 CadillacGothic-Regular">
            Explore Project
          </span> 
          <span className="absolute inset-0 bg-[#28659b] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></span>
        </button>
         </Link>
      </div>
    </motion.div>
  );
};

      
export default Allcommercialprojects;