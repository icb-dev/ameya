import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X, Menu } from "lucide-react"; 
import '../styles/header.css';
import ameyalogo from "../assets/logo/ameya-logo.png";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [mobileProjectOpen, setMobileProjectOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <header className={`ar-header ${isSticky ? "ar-header-sticky" : "ar-header-transparent"} z-50 transition-all duration-300`}>
        <div className="ar-header-containerr w-full flex justify-between items-center px-4 md:px-8 relative h-full">
          
          {/* LEFT NAVIGATION - flex-1 keeps it proportional */}
          <nav className="ar-header-menu hidden lg:flex items-center gap-5 xl:gap-8 flex-1 justify-start">
            <Link to="/" className="ar-header-link text-[13px] xl:text-base whitespace-nowrap">Home</Link>
            <Link to="/About-us" className="ar-header-link text-[13px] xl:text-base whitespace-nowrap">About</Link>

            <div
              className="ar-header-dropdown relative"
              onMouseEnter={() => setProjectOpen(true)}
              onMouseLeave={() => setProjectOpen(false)}
            >
              <div className="ar-header-link flex items-center gap-1 cursor-pointer text-[13px] xl:text-base whitespace-nowrap">
                <span>Projects</span>
                <motion.div
                  animate={{ rotate: projectOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center"
                >
                  <ChevronDown size={14} strokeWidth={3} />
                </motion.div>
              </div>
              
              <AnimatePresence>
                {projectOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="ar-header-dropdown-menu absolute top-full left-0 bg-white shadow-xl rounded-xl py-4 min-w-[200px]"
                  >
                    <Link to="/projects/sapphire-residences" className="dropdown-item block px-6 py-2 hover:text-[#28659b] transition-colors whitespace-nowrap">Residential</Link>
                    <Link to="/Allcommercialprojects" className="dropdown-item block px-6 py-2 hover:text-[#28659b] transition-colors whitespace-nowrap">Commercial</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/Newsandinsights" className="ar-header-link text-[13px] xl:text-base whitespace-nowrap">News & Blogs</Link>
          </nav>

          {/* LOGO - Stays visual center */}
          <div className="ar-header-logo flex-shrink-0 flex justify-center px-4">
            <Link to="/">
              <img src={ameyalogo} alt="Logo" className="h-10 lg:h-12 xl:h-14 w-auto object-contain" />
            </Link>
          </div>

          {/* RIGHT NAVIGATION - Small Contact Button */}
          <div className="ar-header-cta hidden lg:flex items-center justify-end gap-5 xl:gap-8 flex-1">
            <Link to="/Leasing" className="ar-header-link text-[13px] xl:text-base whitespace-nowrap">Leasing</Link>
            <Link to="/Career" className="ar-header-link text-[13px] xl:text-base whitespace-nowrap">Career</Link>
            <button 
            onClick={() => {
              const element = document.getElementById('enquiry-section');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              } else {
                // Optional: If they are on a different page, redirect to home first
                window.location.href = "/#enquiry-section";
              }
            }}
            className="ar-header-link text-[13px] xl:text-base whitespace-nowrap bg-transparent border-none cursor-pointer p-0"
          >
            Enquire Now
            </button>
            <Link to="/Contactus" className="ar-header-btn-interactive scale-75 xl:scale-90 origin-right whitespace-nowrap">
              <span className="px-2">Contact Us</span>
              <div className="btn-fill"></div>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button 
            className="ar-header-hamburger lg:hidden text-slate-900 focus:outline-none ml-auto p-2" 
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={32} />
          </button>
        </div>
      </header>

      {/* --- MOBILE SIDEBAR --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-[360px] bg-white z-[1000] shadow-2xl flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <img src={ameyalogo} alt="Logo" className="h-8 w-auto" />
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <X size={24} className="text-slate-600" />
                </button>
              </div>

              <div className="flex flex-col p-6 gap-6">
                <Link onClick={() => setMobileMenuOpen(false)} to="/" className="text-xl font-bold text-slate-800">Home</Link>
                <Link onClick={() => setMobileMenuOpen(false)} to="/about2" className="text-xl font-bold text-slate-800">About</Link>

                <div className="flex flex-col">
                  <button 
                    onClick={() => setMobileProjectOpen(!mobileProjectOpen)}
                    className="flex items-center justify-between text-xl font-bold text-slate-800"
                  >
                    Projects
                    <motion.div animate={{ rotate: mobileProjectOpen ? 180 : 0 }}>
                      <ChevronDown size={24} />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {mobileProjectOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-4 border-l-2 border-slate-100 mt-2 flex flex-col gap-4"
                      >
                        <Link onClick={() => setMobileMenuOpen(false)} to="/projects/sapphire-residences" className="text-lg text-slate-600 pt-2 block">Residential</Link>
                        <Link onClick={() => setMobileMenuOpen(false)} to="/Allcommercialprojects" className="text-lg text-slate-600 block">Commercial</Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link onClick={() => setMobileMenuOpen(false)} to="/Newsandinsights" className="text-xl font-bold text-slate-800">News & Blogs</Link>
                <Link onClick={() => setMobileMenuOpen(false)} to="/Leasing" className="text-xl font-bold text-slate-800">Leasing</Link>
                <Link onClick={() => setMobileMenuOpen(false)} to="/Career" className="text-xl font-bold text-slate-800">Careers</Link>
                <button 
                onClick={() => {
                  const element = document.getElementById('enquiry-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    // Optional: If they are on a different page, redirect to home first
                    window.location.href = "/#enquiry-section";
                  }
                }}
                className="text-xl font-bold text-slate-800 text-left"
                >
                Enquire Now
                </button>  
              </div>
                            
              <div className="mt-auto p-6 bg-slate-50">
                <Link 
                  onClick={() => setMobileMenuOpen(false)} 
                  to="/Contactus" 
                  className="flex items-center justify-center w-full bg-[#28659b] text-white py-4 rounded-lg font-bold uppercase tracking-widest shadow-lg"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;