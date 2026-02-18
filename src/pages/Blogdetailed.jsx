import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ContactCTA from "../components/ContactCTA";
// Swiper Styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Asset Imports
import blogHero from "../assets/images/blogdbg.jpg";
import recentThumb from "../assets/images/ctabg2.png";

const API_BASE = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000/api';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const formatDate = (isoDate) => {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

const estReadTime = (html) => {
  if (!html) return '5 Min Read';
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} Min Read`;
};

const BlogDetailed = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/blogs/${slug}`);
        if (!res.ok) throw new Error('Blog not found');
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        setError(err.message);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch(`${API_BASE}/blogs?limit=6`);
        const data = await res.json();
        const items = (data?.items || []).filter((b) => b.slug !== slug);
        setRecentBlogs(items.slice(0, 6));
      } catch {
        setRecentBlogs([]);
      }
    };
    fetchRecent();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-[#28659b] border-t-transparent" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || 'Blog not found'}</p>
          <Link to="/Newsandinsights" className="text-[#28659b] underline">Back to News & Insights</Link>
        </div>
      </div>
    );
  }

  const similarBlogs = recentBlogs.slice(0, 6);
  const recentForSidebar = recentBlogs.slice(0, 3);

  return (
    <div className="bg-[#ffffff] min-h-screen selection:bg-[#28659b] selection:text-white">
      
      {/* SECTION 1: FULL SCREEN HERO HEADER */}
      <section className="relative w-full h-screen flex items-end overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            src={blog.cover_image_url || blogHero} 
            className="w-full h-full object-cover opacity-70"
            alt={blog.cover_image_alt || blog.title}
            onError={(e) => { e.target.src = blogHero; }}
          />
          <div className="absolute inset-0 z-[5] bg-gradient-to-b from-black/80 via-transparent to-black" />
        </div>


        <div className="relative z-10 w-full max-w-[1450px] mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
              <h4 className="text-white xs:text-[18px] text-[26px] md:text-[34px] lg:text-[38px] xl:text-[48px] font-serif PlayfairDisplay leading-tight mb-4 md:mb-12 max-w-5xl">
              {blog.category}
            </h4>
            <h1 className="text-white xs:text-[18px] text-[26px] md:text-[34px] lg:text-[38px] xl:text-[48px] font-serif PlayfairDisplay leading-tight mb-4 md:mb-12 max-w-5xl">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/60 text-[10px] md:text-[12px] uppercase tracking-[0em] md:tracking-[0.1em] CadillacGothic-Regular">
              <span className="flex items-center gap-2">
                <span className="w-8 h-[1px] bg-[#ff0000]" /> By Ameya Editorial
              </span>
              <span>{formatDate(blog.published_at)}</span>
              <span>{estReadTime(blog.content)}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: MAIN CONTENT (65-35 SPLIT) */}
      <section className="max-w-[1450px] mx-auto px-6 py-24">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          
          {/* LEFT 65%: ACTUAL BLOG CONTENT */}
          <div className="lg:w-[65%]">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="prose prose-lg max-w-none text-black CadillacGothic-Regular leading-[1.6] text-[14px] md:text-[16px]"
            >
              <p className="text-[18px] md:text-[18px] lg:text-[22px] xl:text-2xl font-serif PlayfairDisplay text-black mb-10 leading-[1.4] md:leading-relaxed italic">
                {blog.excerpt}
              </p>
              
              <div className="w-20 h-[2px] bg-[#9d2a2a] mb-10" />
              
              {blog.content && (
                <div 
                  className="blog-content [&>h3]:text-2xl [&>h3]:font-serif [&>h3]:PlayfairDisplay [&>h3]:text-black [&>h3]:mt-12 [&>h3]:mb-6 [&>h3]:tracking-tight [&>p]:mb-8 [&>blockquote]:border-l-4 [&>blockquote]:border-[#28659b] [&>blockquote]:pl-8 [&>blockquote]:py-6 [&>blockquote]:my-12 [&>blockquote]:bg-white [&>blockquote]:shadow-[0_10px_30px_rgba(0,0,0,0.25)] [&>blockquote]:text-xl [&>blockquote]:italic [&>blockquote]:font-serif [&>blockquote]:PlayfairDisplay [&>blockquote]:text-[#28659b]"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              )}
            </motion.div>

            {/* PREVIOUS & NEXT LINKS */}
            <div className="mt-20 pt-10 border-t border-gray-200 flex justify-between items-center gap-8">
              {recentBlogs[1] ? (
                <Link to={`/Blogdetailed/${recentBlogs[1].slug}`} className="group flex flex-col items-start gap-2 max-w-[200px]">
                  <span className="text-[10px] uppercase tracking-widest text-gray-800 CadillacGothic-Regular">Previous</span>
                  <span className="text-black font-serif PlayfairDisplay group-hover:text-[#28659b] transition-colors leading-tight line-clamp-2">{recentBlogs[1].title}</span>
                </Link>
              ) : (
                <div />
              )}
              {recentBlogs[0] && recentBlogs[0].slug !== slug ? (
                <Link to={`/Blogdetailed/${recentBlogs[0].slug}`} className="group flex flex-col items-end gap-2 text-right max-w-[200px]">
                  <span className="text-[10px] uppercase tracking-widest text-gray-800 CadillacGothic-Regular">Next</span>
                  <span className="text-black font-serif PlayfairDisplay group-hover:text-[#28659b] transition-colors leading-tight line-clamp-2">{recentBlogs[0].title}</span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>

          {/* RIGHT 35%: SIDEBAR WITH STICKY FORM */}
          <aside className="lg:w-[35%] h-full">
            <div className="space-y-16">
              {/* Recent Posts Card */}
              <div className="bg-white p-8 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                <h4 className="text-[14px] uppercase tracking-[0.3em] font-bold mb-8 CadillacGothic-Regular flex items-center gap-4 text-black">
                  Recent <span className="h-[1px] flex-grow bg-[#9d2a2a]/30"></span>
                </h4>
                <div className="space-y-6">
                  {recentForSidebar.map((item) => (
                    <Link key={item.id} to={`/Blogdetailed/${item.slug}`} className="flex gap-4 group">
                      <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                        <img src={item.cover_image_url || recentThumb} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.cover_image_alt || item.title} />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h5 className="text-[14px] font-serif PlayfairDisplay leading-tight group-hover:text-[#28659b] transition-colors line-clamp-2">{item.title}</h5>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* STICKY FORM SECTION */}
              <div className="sticky top-28 z-30">
                <div className="bg-white p-10 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                  <h4 className="text-3xl md:text-2xl font-serif PlayfairDisplay mb-2 text-black text-center">Consult with Us</h4>
                  <p className="text-[12px] text-black mb-8 CadillacGothic-Regular text-center">Request a detailed project report or market analysis.</p>
                  <form className="space-y-6">
                    <input type="text" placeholder="Full Name" className="w-full bg-transparent border-b border-gray-200 py-3 text-xs outline-none focus:border-[#28659b] CadillacGothic-Regular transition-all" />
                    <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-gray-200 py-3 text-xs outline-none focus:border-[#28659b] CadillacGothic-Regular transition-all" />
                    <textarea placeholder="Tell us about your requirement..." className="w-full bg-transparent border-b border-gray-200 py-3 text-xs outline-none focus:border-[#28659b] CadillacGothic-Regular transition-all resize-none" rows="3"></textarea>
                    
                    <button className="group relative w-full py-4 bg-black text-white text-[11px] uppercase tracking-widest font-bold overflow-hidden transition-all shadow-lg CadillacGothic-Regular">
                      <span className="relative z-10">Submit Inquiry</span>
                      <div className="absolute inset-0 bg-[#28659b] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* SECTION 3: FULL WIDTH 4-COLUMN SIMILAR POSTS CAROUSEL */}
      <section className="bg-white py-14 md:py-24 border-t border-gray-100">
        <div className="max-w-[1450px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-4">
            <div>
              <p className="text-[#28659b] text-[12px] md:text-[14px] uppercase tracking-[0.3em] mb-2 md:mb-4 CadillacGothic-Regular">Recommended</p>
              <h3 className="text-[26px] md:text-4xl font-serif PlayfairDisplay text-black">Explore Similar Insights</h3>
            </div>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 6000 }}
            pagination={{ clickable: true, className: "custom-swiper-pagination" }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 }
            }}
            className="pb-20"
          >
            {similarBlogs.map((item) => (
              <SwiperSlide key={item.id}>
                <Link to={`/Blogdetailed/${item.slug}`}>
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="bg-white group cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 rounded-sm overflow-hidden border border-gray-100 flex flex-col h-full"
                  >
                    <div className="overflow-hidden h-[220px] relative">
                      <img src={item.cover_image_url || recentThumb} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.cover_image_alt || item.title} />
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <h4 className="text-[18px] font-serif PlayfairDisplay leading-tight group-hover:text-[#28659b] transition-colors mb-10 line-clamp-2 min-h-[44px]">
                        {item.title}
                      </h4>
                      
                      <span className="relative group/btn overflow-hidden w-[50%] py-3 border border-[#28659b] text-[#28659b] text-[10px] uppercase tracking-widest font-bold transition-all duration-500 hover:text-white CadillacGothic-Regular mt-auto inline-flex items-center justify-center">
                        <span className="relative z-10">Read More</span>
                        <div className="absolute inset-0 bg-[#28659b] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* SECTION 3: CONTACT CTA */}
      <ContactCTA />
    </div>
  );
};

export default BlogDetailed;
