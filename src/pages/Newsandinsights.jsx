import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ContactCTA from "../components/ContactCTA";
// Asset Import
import newsBanner from "../assets/images/blogbnr.jpg";
import newsThumb1 from "../assets/images/ctabg2.png";

const API_BASE = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000/api';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (isoDate) => {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

const Newsandinsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE}/blogs`);
        const data = await res.json();
        setInsights(data?.items || []);
      } catch {
        setInsights([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="bg-[#f1f8ff] min-h-screen">
      
      {/* SECTION 1: BANNER (Gold Standard Responsive Height) */}
      <section className="relative h-[50vh] md:h-[65vh] flex items-end overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <motion.img
            src={newsBanner}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 w-full h-full object-cover"
            alt="News Banner"
          />
          <div className="absolute inset-0 z-[5] bg-gradient-to-b from-black/80 via-transparent to-black" />
        </div>
        
        {/* Banner Content Container - Preserving Desktop Breadth */}
        <div className="relative z-10 w-full max-w-[1450px] mx-auto px-6 md:px-6 pb-12 md:pb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start"
          >
            <h1 className="text-white text-3xl md:text-[48px] font-serif PlayfairDisplay mb-4">
              News & Insights
            </h1>
            <div className="flex items-center gap-2 text-white/70 text-[10px] md:text-[11px] uppercase tracking-[0.3em] CadillacGothic-Regular">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span className="text-[#9d2a2a]">/</span>
              <span className="text-white">News & Blog</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: INTRO */}
      <section className="py-16 md:py-24 px-6 text-center max-w-4xl mx-auto">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-[#28659b] text-[12px] md:text-[14px] uppercase tracking-[0.3em] font-bold block mb-4 CadillacGothic-Regular"
        >
          Our Perspective
        </motion.span>
        <h2 className="xs:text-[18px] text-[26px] md:text-[34px] lg:text-[38px] xl:text-[48px] font-serif PlayfairDisplay mb-6 text-black tracking-tight leading-tight">
          Ameya News and Insights
        </h2>
        <div className="w-20 h-[1.5px] bg-[#9d2a2a] mx-auto mb-8" />
        <p className="text-black CadillacGothic-Regular text-[14px] md:text-[16px] leading-relaxed max-w-2xl mx-auto">
          Stay informed with our deep dives into the real estate market, architectural breakthroughs, and milestones that define Ameya Group's legacy.
        </p>
      </section>

      {/* SECTION 3: MAIN LAYOUT (Targeted 1024px Adjustments) */}
      <section className="max-w-[1450px] mx-auto px-6 pb-20 md:pb-32">
        {/* lg:flex-row handles 1024px+. For 1024, we ensure gap isn't too large */}
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
          
          {/* LEFT 65%: PREMIUM CARDS GRID */}
          <div className="w-full lg:w-[65%]">
            {loading ? (
              <div className="py-20 text-center text-gray-500">Loading...</div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:gap-10">
              {insights.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white group cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 rounded-sm overflow-hidden border border-gray-100 flex flex-col"
                >
                  <div className="overflow-hidden relative h-[220px] xl:h-[260px]">
                    {item.category && (
                      <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#28659b] text-white text-[10px] font-bold uppercase tracking-wider CadillacGothic-Regular">
                        {item.category}
                      </span>
                    )}
                    <motion.img 
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.8 }}
                      src={item.cover_image_url || newsThumb1}
                          className="w-full h-full object-cover"
                          alt={item.cover_image_alt || item.title}
                          onError={(e) => { e.target.src = newsThumb1; }}
                    />
                  </div>
                  
                  <div className="p-6 xl:p-8 flex flex-col flex-grow">
                    <p className="text-[#9d2a2a] text-[10px] font-bold mb-3 CadillacGothic-Regular tracking-widest">{formatDate(item.published_at)}</p>
                    <h3 className="text-lg xl:text-xl font-serif PlayfairDisplay mb-4 text-black group-hover:text-[#28659b] transition-colors leading-snug line-clamp-2 h-[50px] md:h-[60px]">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-[13px] xl:text-[14px] CadillacGothic-Regular line-clamp-3 mb-8 h-[60px]">
                      {item.excerpt}
                    </p>
                    
                    <button className="mt-auto relative group/btn overflow-hidden px-8 py-3 border border-[#28659b] text-[#28659b] text-[11px] xl:text-[13px] uppercase tracking-widest font-bold transition-all duration-500 hover:text-white CadillacGothic-Regular w-full">
                      <Link to={`/Blogdetailed/${item.slug}`}><span className="relative z-10">Read More</span></Link> 
                      <div className="absolute inset-0 bg-[#28659b] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out"></div>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            )}

            {/* PAGINATION */}
            <div className="mt-12 md:mt-20 flex flex-col sm:flex-row justify-between items-center gap-8 border-t border-gray-200 pt-12">
              <button className="group relative w-full sm:w-auto px-10 py-4 bg-white border-2 border-[#28659b] text-[#28659b] overflow-hidden text-[14px] uppercase tracking-[0.2em] font-bold CadillacGothic-Regular transition-all duration-500">
                <span className="relative z-10 group-hover:text-white">+ Load More</span>
                <div className="absolute inset-0 bg-[#28659b] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              </button>

              <div className="flex items-center gap-3">
                {[1, 2, 3].map((num) => (
                  <button key={num} className={`w-10 h-10 flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${num === 1 ? 'bg-[#28659b] text-white' : 'bg-white text-gray-400 border border-gray-100 hover:border-[#28659b]'}`}>
                    0{num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT 35%: SIDEBAR - Stacks on mobile, Side-by-side on 1024px */}
          <aside className="w-full lg:w-[35%] space-y-12 xl:space-y-16">
            {/* Recent Posts */}
            {!loading && insights.length > 0 && (
              <div className="bg-white p-6 xl:p-8 border border-gray-100 shadow-sm">
                <h4 className="text-[12px] xl:text-[14px] uppercase tracking-[0.3em] font-bold mb-8 CadillacGothic-Regular flex items-center gap-4 text-black">
                  Recent Posts <span className="h-[1px] flex-grow bg-[#9d2a2a]/20"></span>
                </h4>
                {insights.slice(0, 3).map((item) => (
                  <Link key={item.id} to={`/Blogdetailed/${item.slug}`} className="flex gap-4 mb-6 xl:mb-8 group last:mb-0">
                    <div className="w-16 h-16 xl:w-20 xl:h-20 flex-shrink-0 overflow-hidden bg-gray-100">
                      <img src={item.cover_image_url || newsThumb1} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.cover_image_alt || item.title} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h5 className="text-[13px] xl:text-[14px] font-serif PlayfairDisplay leading-tight group-hover:text-[#28659b] transition-colors line-clamp-2">{item.title}</h5>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Newsletter */}
            <div className="bg-[#28659b] p-8 xl:p-10 text-white relative overflow-hidden group">
               <div className="relative z-10">
                <h4 className="text-xl xl:text-2xl font-serif PlayfairDisplay mb-4">Newsletter</h4>
                <p className="text-[12px] xl:text-[13px] opacity-80 mb-8 CadillacGothic-Regular italic leading-relaxed">Stay updated with the latest trends in Gurugram's skyline.</p>
                <form className="space-y-4">
                  <input type="email" placeholder="YOUR EMAIL" className="w-full bg-white/10 border border-white/20 p-4 text-[10px] outline-none focus:bg-white focus:text-black transition-all placeholder:text-white/40" />
                  <button className="w-full bg-white text-[#28659b] py-4 text-[11px] uppercase tracking-widest font-bold hover:bg-black hover:text-white transition-all duration-500">
                    Subscribe
                  </button>
                </form>
               </div>
               <div className="absolute -bottom-10 -right-10 text-white opacity-5 text-7xl xl:text-8xl font-serif select-none pointer-events-none">AMEYA</div>
            </div>

          </aside>

        </div>
      </section>

       {/* SECTION 3: CONTACT CTA */}
      <ContactCTA />

    </div>
  );
};

export default Newsandinsights;