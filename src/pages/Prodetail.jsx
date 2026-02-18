import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { getProjectBySlug, getProjectSections } from '../../services/projectService';
import { mapProjectDetail, parseSections, mergeSectionsIntoProject } from '../utils/projectMapper';
import { 
  Plus, Minus, Maximize2, MapPin, 
  ShieldCheck, TreePine, Train, Building2, ChevronLeft, ChevronRight, Globe,
  Maximize, ArrowUpRight, ShoppingCart, Layout, Send, X 
} from 'lucide-react';

import ProjectGallery from '../components/ProjectGallery.jsx';
import Prodamenities from '../components/Prodamenities.jsx';
import Prodmix from '../components/Prodmix.jsx';
import Projectfloorplan from '../components/Projectfloorplan.jsx';
import ProjectApproach from "../components/ProjectApproach.jsx";
import Newhigh2 from '../components/Newhigh2.jsx';
import Projectlocations from '../components/Projectlocations.jsx'; 
import Projectfaqform from '../components/Projectfaqform.jsx';
import ContactCTA from "../components/ContactCTA";

import sapphirefeatured from '../assets/images/shaphirebnrbg.png';  
import fc from "../assets/images/fc.png";
import '../styles/home2.css';

/* -------------------------------------------------------------------------- */
/* 1. LOCAL MOCK DATA                                                         */
/* -------------------------------------------------------------------------- */
const defaultData = {
  title: "Sapphire 57",
  brand: "",
  highlights: ["RERA Approved", "High-Street Retail", "Zero Debt Project", "Prime Connectivity"],
  about: {
    title: "Sector57 is Getting its Own Neighbourhood Bazaar",
    subtitle: "OVERVIEW",
    description: "The ease of shopping, the comfort of proximity, seeing and meeting people from your locality, opportunities for impromptu conversations, the joy of a quick bite and the unexpected deals - all in one place. Neighbourhood Bazaars were and will always remain hot destinations for families. Sector 57's newest neighbourhood bazaar, Sapphire 57, is one such destination where you can go to fulfil all of your heart's desires.",
    image: fc,
  },
  location: { connectivity: [] }
};

/* -------------------------------------------------------------------------- */
/* 2. REUSABLE COMPONENTS                                                     */
/* -------------------------------------------------------------------------- */
const SectionHeader = ({ title, subtitle, light = false, center = false, logo = null }) => (
  <div className={`mb-12 ${center ? 'text-center' : 'text-left'}`}>
    {logo && (
      <motion.img 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        src={logo} 
        alt="Logo" 
        className={`h-16 w-auto mb-6 object-contain ${center ? 'mx-auto' : ''}`}
      />
    )}
    <motion.p 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={`text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold mb-4 ${light ? 'text-white/50' : 'text-[#28659b] CadillacGothic-Regular'}`}
    >
      {subtitle}
    </motion.p>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={`xs:text-[22px] text-[28px] md:text-[36px] lg:text-[38px] xl:text-[48px] font-serif leading-tight PlayfairDisplay ${light ? 'text-white' : 'text-black tracking-tight'}`}
    >
      {title}
    </motion.h2>
  </div>
);

/* -------------------------------------------------------------------------- */
/* 3. MAIN COMPONENT                                                          */
/* -------------------------------------------------------------------------- */
const ProjectDetail = ({ data: dataProp }) => {
  const { slug } = useParams();
  const [project, setProject] = useState(dataProp ?? defaultData);
  const [loading, setLoading] = useState(!!slug);
  const [error, setError] = useState(null);

  // States for Popup Logic
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formContext, setFormContext] = useState({ title: "", type: "" });

  const openContactForm = (title, type) => {
    setFormContext({ title, type });
    setIsFormOpen(true);
  };

  useEffect(() => {
    if (!slug) {
      setProject(dataProp ?? defaultData);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getProjectBySlug(slug)
      .then((apiProject) => {
        if (cancelled) return;
        const merged = mapProjectDetail(apiProject, defaultData);
        return getProjectSections(apiProject.id)
          .then((apiSections) => {
            if (cancelled) return;
            const sections = parseSections(apiSections);
            return mergeSectionsIntoProject(merged, sections);
          })
          .catch(() => merged);
      })
      .then((finalProject) => {
        if (!cancelled && finalProject) {
          setProject(finalProject);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message ?? 'Failed to load project');
          setProject(defaultData);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug, dataProp]);

  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bannerY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <main className="relative w-full bg-white antialiased overflow-x-hidden selection:bg-amber-100 selection:text-amber-900">
      {loading && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-[#28659b] border-t-transparent" />
            <p className="mt-4 text-gray-600">Loading project…</p>
          </div>
        </div>
      )}

      {/* SECTION 1: HERO */}
      <section ref={heroRef} className="relative w-full h-[90vh] md:h-screen flex items-end justify-center overflow-hidden">
        <motion.div style={{ y: bannerY }} className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.3 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            src={project.bannerImage} 
            className="w-full h-[120%] object-cover" 
            alt="Hero" 
          />
          <div className="absolute inset-0 ar-prodetail-hero-overlay from-black/90 via-black/20 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-[1450px] mx-auto w-full px-6 text-center mb-[40%] md:mb-[14%] flex justify-center items-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
           
            <span className="text-white text-xs md:text-[22px] tracking-[0.2em] uppercase mb-6 block font-bold CadillacGothic-Regular">
              {project.brand}
            </span>
            <div className="w-full flex justify-center">
              <img src={project.logo} width="400" height="auto" alt={project.title || ''} />
            </div>  

               {/* HIGHLIGHTED RERA NUMBER SECTION */}
      {project.rera && (
        <div className="flex justify-center mb-1 mt-8">
          <span
            className="
              inline-block
              px-3 py-1 md:px-5 md:py-2.5
              bg-black/40 backdrop-blur-md
              border border-white rounded-full
              shadow-[0_4px_15px_rgba(0,0,0,0.2)]
            "
          >
            <h1 
              className="
                text-white font-medium NeueHaasDisplay-Roman uppercase
                text-[9px] sm:text-[10px] md:text-[12px]
                tracking-[0.1em] md:tracking-[0.1em]
                leading-none
              "
            >
              <span className="opacity-60 mr-1 md:mr-2">RERA:</span> {project.rera}
            </h1>
          </span>
        </div>
      )}

          </motion.div>
        </div>
      </section>

      {/* SECTION 2: ABOUT */}
      <section ref={aboutRef} className="relative py-24 md:py-36 border-b border-gray-100 overflow-hidden">
        <div className="max-w-[1450px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-16 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 ">
              <SectionHeader  title={project.about.title} subtitle={project.about.subtitle} />
              <p className="text-[14px] md:text-[14px] lg:text-[14px] xl:text-[16px] text-[#000] font-light leading-[1.5] CadillacGothic-Regular mb-12 xl:w-[85%] text-justify">
                {project.about.description}
              </p>
              <button onClick={() => openContactForm("Request Brochure", "brochure_download")} className="group relative overflow-hidden px-10 py-4 rounded-full bg-[#28659b] text-white text-[14px] font-bold uppercase tracking-wide transition-all">
                <span className="relative z-10 CadillacGothic-Regular">Request Brochure</span>
                <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>
            <div className="lg:col-span-4 order-1 lg:order-2 relative aspect-[4/5] overflow-hidden shadow-3xl">
              <img src={project.about.image} className="absolute inset-0 w-full h-full object-cover" alt="Architecture" />
            </div>
          </div>
        </div>
      </section>

      <Newhigh2 highlightsSection={project.highlightsSection} />
      <Prodmix mixSection={project.mixSection} />
      <Prodamenities amenitiesSection={project.amenitiesSection} projectTitle={project.title} />
      <Projectfloorplan projectTitle={project.title} />
      <Projectlocations project={project} projectTitle={project.title} />
      <ProjectGallery gallerySection={project.gallerySection} mediaSection={project.mediaSection} projectTitle={project.title} />
      <ProjectApproach />
      <Projectfaqform faqsSection={project.faqsSection} />  
      <ContactCTA />          

      {/* --- STICKY CTA BUTTON (EXACT FORMATTING) --- */}
      <motion.div 
        initial={{ y: 100 }} 
        animate={{ y: 0 }} 
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-[95%] md:w-auto"
      >
        <div className="bg-white/80 backdrop-blur-2xl border border-white/20 px-1 pl-4 md:px-2 py-1 md:py-2 md:pl-8 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center gap-4 sm:gap-10 md:gap-16 justify-between">
          <div className="flex flex-col justify-center">
            <p className="text-[8px] md:text-[9px] font-bold tracking-[0.8px] uppercase text-[#000000] mb-1 md:mb-2 leading-none NeueHaasDisplay-Roman">
              Investment Inquiry
            </p>
            <p className="text-[12px] md:text-sm font-serif text-black leading-none font-bold Ameyasans-WideMedium">
              {project.title}
            </p>
          </div>
          <button onClick={() => openContactForm("Enquire Now", "brochure_download")} className="bg-[#28659b] text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-[11px] md:text-[13px] font-bold uppercase tracking-[1px] md:tracking-widerder hover:bg-[#28659b] transition-all duration-300 shadow-xl shadow-black/10 CadillacGothic-Regular whitespace-nowrap cursor-pointer">
            Enquire Now
          </button>
        </div>
      </motion.div>

      {/* --- POPUP FORM (EXACT FORMATTING) --- */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]"
            >
              <button 
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-black/10 rounded-full transition-colors md:text-black"
              >
                <X size={24} />
              </button>
              <div className="hidden md:block md:w-1/2 relative">
                <img 
                  src={project.bannerImage || sapphirefeatured} 
                  alt="Project View" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/40 to-transparent" />
                <div className="absolute bottom-10 left-10 text-white">
                  <h4 className="text-2xl font-serif PlayfairDisplay">{project.title}</h4> 
                </div>
              </div>
              <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white">
                <div className="mb-8">
                  <p className="text-[#40a6ff] text-[10px] uppercase tracking-[0.3em] font-bold mb-2 CadillacGothic-Regular">Get in Touch</p>
                  <h3 className="text-2xl sm:text-3xl font-serif PlayfairDisplay text-black leading-tight">
                    {formContext.title}
                  </h3>
                </div>
                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); }}>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-gray-800 font-bold CadillacGothic-Regular">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#28659b] transition-colors text-black" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-gray-800 font-bold CadillacGothic-Regular">Phone Number</label>
                    <input type="tel" placeholder="+91 00000 00000" className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#28659b] transition-colors text-black" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-gray-800 font-bold CadillacGothic-Regular">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full border-b border-gray-200 py-2 outline-none focus:border-[#28659b] transition-colors text-black" required />
                  </div>
                  <input type="hidden" value={formContext.type} />
                  <button className="w-full mt-8 group relative overflow-hidden bg-[#28659b] py-4 rounded-md transition-all">
                    <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center justify-center gap-3 text-white font-bold uppercase tracking-widest text-sm CadillacGothic-Regular">
                      Submit Request <Send size={16} />
                    </span>
                  </button>
                </form>
                <p className="mt-6 text-[10px] text-gray-700 text-center leading-relaxed">
                  By submitting, you agree to our privacy policy and terms of service.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default ProjectDetail;