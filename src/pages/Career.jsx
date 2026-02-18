import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ContactCTA from "../components/ContactCTA";
// Asset Imports
import career1 from "../assets/images/career1.jpg";

const BANNER_IMAGES = [career1];

const Career = () => {
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="bg-white min-h-screen">
      
      {/* SECTION 1: BANNER (Responsive Height, Original Desktop Width) */}
      <section className="relative h-[50vh] md:h-[65vh] flex items-end overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImg}
              src={BANNER_IMAGES[currentImg]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
              alt="Career Background"
            />
          </AnimatePresence>
        </div>

        {/* 3-Point Gradient Overlay */}
        <div 
          className="absolute inset-0 z-[5] bg-gradient-to-b from-black/80 via-transparent to-black"
          style={{ pointerEvents: 'none' }}
        />

        {/* Desktop Layout Preserved: md:px-0 and md:pb-24 */}
        <div className="relative z-10 w-full max-w-[1450px] mx-auto px-6 md:px-6 pb-12 md:pb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start"
          >
            <h1 className="text-white text-3xl md:text-[48px] font-serif PlayfairDisplay mb-4">
              Career
            </h1>
            
            <div className="flex items-center gap-2 text-white/70 text-[10px] md:text-[12px] uppercase tracking-[0.2em] CadillacGothic-Regular">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">Career</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: TOP CENTER CONTENT - Original Desktop Spacing */}
      <section className="pt-16 md:pt-24 pb-12 md:pb-16 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="xs:text-[18px] text-[26px] md:text-[34px] lg:text-[38px] xl:text-[48px] font-serif PlayfairDisplay text-black mb-6 tracking-tight">
            Build Your Future With Us
          </h2>
          <p className="text-black CadillacGothic-Regular text-[14px] md:text-[16px] leading-relaxed mb-8">
            At Ameya, we value innovation, dedication, and the drive to redefine urban landscapes. 
            We are always looking for talented individuals who share our passion for excellence 
            and want to contribute to landmark projects that stand the test of time.
          </p>
          <div className="inline-block">
            <p className="text-[#28659b] CadillacGothic-Bold text-[12px] md:text-[14px] uppercase tracking-[0.1em] border-b border-[#28659b]/30 pb-2">
              Send your CV directly to: hr@ameyagroup.in
            </p>
          </div>
        </motion.div>
      </section>

      {/* SECTION 3: APPLICATION FORM - Original Desktop Padding md:p-16 */}
      <section className="pb-20 md:pb-32 px-4 md:px-6">
        <div className="max-w-[1000px] mx-auto bg-[#28659b] p-8 md:p-16 shadow-sm border border-gray-300 rounded-lg">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            
            <div className="flex flex-col gap-2">
              <label className="text-[13px] uppercase tracking-widest font-bold CadillacGothic-Regular text-white">Full Name *</label>
              <input 
                type="text" 
                placeholder="John Doe"
                className="text-white placeholder-white/50 bg-transparent border-b border-gray-300 py-3 outline-none focus:border-[#ffffff] transition-colors CadillacGothic-Regular text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] uppercase tracking-widest font-bold CadillacGothic-Regular text-white">Email Address *</label>
              <input 
                type="email" 
                placeholder="john@example.com"
                required
                className="text-white placeholder-white/50 bg-transparent border-b border-gray-300 py-3 outline-none focus:border-[#ffffff] transition-colors CadillacGothic-Regular text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] uppercase tracking-widest font-bold CadillacGothic-Regular text-white">Phone Number *</label>
              <input 
                type="tel" 
                placeholder="+91 00000 00000"
                required
                className="text-white placeholder-white/50 bg-transparent border-b border-gray-300 py-3 outline-none focus:border-[#ffffff] transition-colors CadillacGothic-Regular text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] uppercase tracking-widest font-bold CadillacGothic-Regular text-white">Position *</label>
              <select required className="bg-transparent border-b border-gray-300 py-3 outline-none focus:border-[#ffffff] transition-colors CadillacGothic-Regular text-sm text-white cursor-pointer appearance-none">
                <option className="text-black">Sales & Marketing</option>
                <option className="text-black">Civil Engineering</option>
                <option className="text-black">Architecture & Design</option>
                <option className="text-black">Finance & Accounts</option>
                <option className="text-black">Operations</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[13px] uppercase tracking-widest font-bold CadillacGothic-Regular text-white">Brief Experience Summary</label>
              <textarea 
                rows="4"
                required
                placeholder="Tell us about your previous roles..."
                className="text-white bg-transparent border-b border-gray-300 py-3 outline-none focus:border-[#ffffff] transition-colors CadillacGothic-Regular text-sm resize-none placeholder-white/50"
              ></textarea> 
            </div>

            <div className="flex flex-col gap-2 md:col-span-2 mt-4">
              <label className="text-[13px] uppercase tracking-widest font-bold CadillacGothic-Regular text-white">Attach Resume (PDF/DOC)</label>
              <input 
                type="file" 
                required
                className="text-white text-sm CadillacGothic-Regular mt-2 
                file:mr-4 file:py-2 file:px-4 file:border-0 
                file:text-[11px] file:uppercase file:tracking-widest file:font-bold 
                file:bg-[#000000] file:text-white hover:file:bg-black file:transition-all cursor-pointer"
              />
            </div>

            <div className="md:col-span-2 mt-8">
              <button className="w-full md:w-auto px-6 md:px-16 py-4 bg-[#000000] text-white uppercase text-[12px]  md:text-[14px] tracking-widest font-bold transition-all duration-500 hover:bg-white shadow-lg shadow-[#28659b]/20 CadillacGothic-Regular hover:text-[#28659b]">
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* SECTION 3: CONTACT CTA */}
      <ContactCTA />
    </main>
  );
};

export default Career;