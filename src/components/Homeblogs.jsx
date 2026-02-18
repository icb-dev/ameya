import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000/api';
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const formatDate = (isoDate) => {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

const mapApiToItem = (b) => ({
  id: b.id,
  slug: b.slug,
  date: formatDate(b.published_at),
  title: b.title || '',
  excerpt: b.excerpt || '',
  image: b.cover_image_url || '',
  imageAlt: b.cover_image_alt || b.title || '',
  category: b.category || '',
});

const Homeblogs = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE}/blogs`);
        const data = await res.json();
        const list = (data?.items || []).map(mapApiToItem);
        setItems(list);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Function to handle desktop rotation logic
  const rotateItems = (dir) => {
    setDirection(dir);
    setItems((prev) => {
      const newArray = [...prev];
      if (dir > 0) {
        const first = newArray.shift();
        newArray.push(first);
      } else {
        const last = newArray.pop();
        newArray.unshift(last);
      }
      return newArray;
    });
  };

  // Improved Tab/Mobile navigation: Scrolls the container physically
  const handleMobileNav = (dir) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth * (window.innerWidth < 768 ? 0.8 : 0.45);
      scrollRef.current.scrollBy({
        left: dir > 0 ? cardWidth : -cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const next = () => {
    if (window.innerWidth >= 1024) rotateItems(1);
    else handleMobileNav(1);
  };

  const prev = () => {
    if (window.innerWidth >= 1024) rotateItems(-1);
    else handleMobileNav(-1);
  };

  const leftItems = [items[0], items[1]].filter(Boolean);
  const rightItems = [items[2], items[3], items[4]].filter(Boolean);

  return (
    <section className="bg-white pt-12 md:pt-22 lg:pt-12 xl:pt-22 pb-20 lg:pb-32 px-6 overflow-hidden">
      <div className="max-w-[1450px] mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="text-[12px] lg:text-[14px] text-[#28659b] tracking-[1.2px] uppercase font-bold mb-3 block CadillacGothic-Regular">
            Ameya Group Updates
          </span>
          <h2 className="text-3xl md:text-[40px] lg:text-[38px] xl:text-[48px] font-serif tracking-tight text-black pb-4 lg:pb-8 PlayfairDisplay leading-tight">
            News & Insights from Ameya Group
          </h2>
        </div>

        {/* RESPONSIVE WRAPPER */}
        <div className="flex lg:grid lg:grid-cols-10 gap-6 md:gap-8 lg:gap-12 items-start pb-10 lg:pb-0">
          
          {/* MOBILE & TAB SLIDER (Visible < 1024px) */}
          <div 
            ref={scrollRef}
            className="flex lg:hidden overflow-x-auto snap-x snap-mandatory no-scrollbar gap-6 md:gap-8 transition-all"
          >
            {loading ? (
              <div className="w-full py-12 text-center text-gray-500">Loading...</div>
            ) : (
              items.map((item) => (
                <div 
                  key={`mobile-${item.id}`}
                  className="w-[80vw] md:w-[45vw] flex-shrink-0 snap-center group"
                >
                  <div className="relative aspect-[16/11] overflow-hidden mb-6 bg-gray-50">
                    {item.category && (
                      <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#28659b] text-white text-[10px] font-bold uppercase tracking-wider CadillacGothic-Regular">
                        {item.category}
                      </span>
                    )}
                    <img src={item.image} className="w-full h-full object-cover" alt={item.imageAlt} />
                  </div>
                  <p className="text-[10px] text-gray-700 tracking-widest mb-2 uppercase NeueHaasDisplay-Roman italic">{item.date}</p>
                  <h3 className="text-[18px] md:text-[20px] font-serif mb-3 line-clamp-2 leading-tight CadillacGothic-Regular tracking-tight">{item.title}</h3>
                  
                  {/* RESTORED EXCERPT FOR MOBILE/TAB */}
                  <p className="text-gray-700 text-[14px] md:text-[15px] font-light line-clamp-2 mb-5 leading-relaxed NeueHaasDisplay-Roman tracking-[0.3px]">
                    {item.excerpt}
                  </p>

                  <Link to={`/Blogdetailed/${item.slug}`} className="flex items-center gap-3"> 
                    <span className="text-[12px] font-bold tracking-[0.1em] md:tracking-[0.3em] uppercase CadillacGothic-Regular">Read Article</span> 
                    <div className="w-8 h-[2px] bg-[#9d2a2a]" />
                  </Link>
                </div>
              ))
            )}
          </div>

          {/* DESKTOP LEFT MAPPING (Visible >= 1024px) - ORIGINAL LAYOUT */}
          <div className="hidden lg:grid lg:col-span-7 grid-cols-1 md:grid-cols-2 gap-10">
            {loading ? (
              <div className="col-span-2 py-12 text-center text-gray-500">Loading...</div>
            ) : (
              <AnimatePresence mode="wait">
                {leftItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                    transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[16/11] overflow-hidden mb-6 bg-gray-50">
                      {item.category && (
                        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#28659b] text-white text-[10px] font-bold uppercase tracking-wider CadillacGothic-Regular">
                          {item.category}
                        </span>
                      )}
                      <motion.img 
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        src={item.image} 
                        className="w-full h-full object-cover" 
                        alt={item.imageAlt} 
                      />
                    </div>
                    <div className="pr-4">
                      <p className="text-[12px] text-gray-700 tracking-widest mb-2 uppercase NeueHaasDisplay-Roman italic">{item.date}</p>
                      <h3 className="text-[22px] font-serif mb-3 group-hover:text-[#28659b] transition-colors line-clamp-2 leading-tight CadillacGothic-Regular tracking-tight">{item.title}</h3>
                      <p className="text-gray-700 text-[16px] font-light line-clamp-2 mb-5 leading-tight NeueHaasDisplay-Roman tracking-[0.3px]">{item.excerpt}</p>
                      <Link to={`/Blogdetailed/${item.slug}`} className="cursor-pointer">
                        <div className="flex items-center gap-3"> 
                          <span className="text-[10px] font-bold tracking-[0.3em] uppercase Ameyasans-WideMedium mt-4 group-hover:text-[#28659b]">Read Article</span> 
                          <div className="w-8 h-[2px] bg-[#9d2a2a] group-hover:w-16 transition-all duration-500 mt-4 group-hover:bg-[#9d2a2a]" />
                        </div>
                      </Link>
                    </div> 
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* DESKTOP RIGHT SIDE (Visible >= 1024px) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-8 border-l border-gray-100 pl-8">
            {loading ? (
              <div className="py-12 text-center text-gray-500">Loading...</div>
            ) : (
              <AnimatePresence mode="wait">
                {rightItems.map((item, idx) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group cursor-pointer flex items-center gap-5"
                  >
                    <div className="w-[30%] aspect-square overflow-hidden bg-gray-100 flex-shrink-0 relative">
                      {item.category && (
                        <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-[#28659b] text-white text-[9px] font-bold uppercase tracking-wider CadillacGothic-Regular">
                          {item.category}
                        </span>
                      )}
                      <motion.img 
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.6 }}
                        src={item.image} 
                        className="w-full h-full object-cover" 
                        alt={item.imageAlt} 
                      />
                    </div>
                    <div className="w-[70%]">
                      <p className="text-[10px] text-gray-700 tracking-widest uppercase NeueHaasDisplay-Roman italic mb-1">{item.date}</p>
                      <h4 className="text-[18px] font-serif leading-snug line-clamp-2 group-hover:text-[#28659b] transition-colors mb-2 CadillacGothic-Regular tracking-tight">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Link to={`/Blogdetailed/${item.slug}`} className="cursor-pointer">
                          <span className="text-[10px] font-bold tracking-[0.6px] uppercase transition-all Ameyasans-WideMedium mt-2 group-hover:text-[#28659b]">Explore</span>
                        </Link>
                        <div className=" mt-2 w-4 h-[2px] bg-gray-300 group-hover:bg-[#9d2a2a] group-hover:w-8 transition-all duration-500" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex flex-row items-center justify-center gap-4 md:gap-12 border-t border-gray-100 pt-10">
          <button onClick={prev} className="w-11 h-11 lg:w-14 lg:h-14 rounded-full border border-black/50 flex items-center justify-center hover:bg-[#28659b] hover:border-[#28659b] hover:text-white transition-all cursor-pointer group">
            <svg xmlns="http://www.w3.org/2000/svg" width="16px" className="fill-black lg:w-[14px] group-hover:fill-white transition-colors duration-300" viewBox="0 0 24 24">
              <path d="m8.732,13.768c-.472-.473-.732-1.101-.732-1.768s.26-1.295.734-1.77L18.026.852c.194-.196.193-.513-.003-.707-.197-.194-.513-.192-.707.004l-9.291,9.377c-.661.661-1.025,1.54-1.025,2.475s.364,1.813,1.024,2.473l9.292,9.379c.098.099.226.148.355.148.127,0,.254-.048.352-.145.196-.194.197-.511.003-.707l-9.294-9.381Z"/>
            </svg>
          </button>

          <Link to="/Newsandinsights" className="ar-about-btn">
            <span className="btn-text">View All Insights</span>
            <span className="btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <div className="btn-background"></div>
          </Link>

          <button onClick={next} className="w-11 h-11 md:w-14 md:h-14 rounded-full border border-black/50 flex items-center justify-center hover:bg-[#28659b] hover:border-[#28659b] hover:text-white transition-all cursor-pointer group">
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" className="fill-black lg:w-[14px] group-hover:fill-white transition-colors duration-300" viewBox="0 0 24 24">
              <path d="m17,12c0,.935-.364,1.813-1.025,2.475l-9.291,9.377c-.098.099-.227.148-.355.148-.127,0-.255-.048-.352-.145-.196-.194-.198-.511-.004-.707l9.293-9.379c.475-.475.734-1.103.734-1.77s-.26-1.295-.732-1.768L5.973.852c-.194-.196-.192-.513.004-.707.195-.195.513-.191.707.004l9.293,9.379c.659.659,1.023,1.538,1.023,2.473Z"/>
            </svg>
          </button>
        </div>

      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Homeblogs;
