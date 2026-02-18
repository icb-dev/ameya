import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ContactCTA from "../components/ContactCTA";
// Asset Imports
import leasingBanner from "../assets/images/leasingimg.jpg"; 

const BANNER_IMAGES = [leasingBanner];

const Leasing = () => {
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      
      {/* SECTION 1: BANNER WITH RESPONSIVE HEIGHT */}
      <section className="relative h-[50vh] md:h-[65vh] flex items-end overflow-hidden bg-black">
        
        {/* IMAGE LAYER */}
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
              alt="Leasing Background"
            />
          </AnimatePresence>
        </div>

        {/* GRADIENT OVERLAY */}
        <div 
          className="absolute inset-0 z-[5] bg-gradient-to-b from-black/80 via-transparent to-black"
          style={{ pointerEvents: 'none' }}
        />

        {/* CONTENT LAYER - Adjusted for mobile padding */}
        <div className="relative z-10 w-full max-w-[1450px] mx-auto px-6 md:px-6 pb-12 md:pb-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start"
          >
            <h1 className="text-white text-3xl md:text-[48px] font-serif PlayfairDisplay mb-4">
              Leasing
            </h1>
            
            <div className="flex items-center gap-2 text-white/70 text-[10px] md:text-[12px] uppercase tracking-[0.2em] CadillacGothic-Regular">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">Leasing Opportunities</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: TOP CENTER CONTENT - Scaling typography */}
      <section className="pt-16 md:pt-24 pb-12 md:pb-16 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="xs:text-[18px] text-[28px] md:text-[34px] lg:text-[38px] xl:text-[48px] font-serif PlayfairDisplay text-black mb-6 tracking-tight leading-tight">
            Ameya Leasing Solutions
          </h2>
          <p className="text-black CadillacGothic-Regular text-[14px] md:text-[16px] leading-relaxed mb-8 max-w-2xl mx-auto">
            Join the community of successful global and local brands at Ameya. 
            Our strategically located high-street retail hubs offer premium leasing 
            solutions tailored for maximum brand visibility and operational efficiency.
          </p>
          <div className="inline-block">
            <a 
              href="mailto:leasing@ameyagroup.in" 
              className="text-[#28659b] CadillacGothic-Bold text-[12px] md:text-[14px] uppercase tracking-[0.1em] border-b border-[#28659b]/30 pb-2 hover:border-[#28659b] transition-all"
            >
              Inquiries: leasing@ameyagroup.in
            </a>
          </div>
        </motion.div>
      </section>

      {/* SECTION 3: LEASING INQUIRY FORM - Mobile optimized padding and grid */}
      <section className="pb-20 md:pb-32 px-4 md:px-6">
        <div className="max-w-[1000px] mx-auto bg-[#28659b] p-6 xs:p-8 md:p-16 shadow-2xl rounded-2xl">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] md:text-[13px] uppercase tracking-widest font-bold CadillacGothic-Regular text-white/80">Full Name *</label>
              <input 
                type="text" 
                placeholder="Enter Your Name"
                required
                className="text-white placeholder-white/50 bg-transparent border-b border-white/30 py-3 outline-none focus:border-white transition-colors CadillacGothic-Regular text-sm"
              />
            </div>

            {/* Project Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] md:text-[13px] uppercase tracking-widest font-bold CadillacGothic-Regular text-white/80">Interested Project *</label>
              <select required className="text-white bg-transparent border-b border-white/30 py-3 outline-none focus:border-white transition-colors CadillacGothic-Regular text-sm cursor-pointer appearance-none">
                <option className="text-black">Select Project</option>
                <option className="text-black">Sapphire 57</option>
                <option className="text-black">Sapphire 83</option>
                <option className="text-black">Sapphire 92</option>
                <option className="text-black">Sapphire 93</option>
              </select>
            </div>

            {/* Mobile */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] md:text-[13px] uppercase tracking-widest font-bold CadillacGothic-Regular text-white/80">Mobile Number *</label>
              <input 
                type="tel" 
                placeholder="+91 00000 00000"
                required
                className="text-white bg-transparent border-b border-white/30 py-3 outline-none focus:border-white transition-colors CadillacGothic-Regular text-sm placeholder-white/50"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] md:text-[13px] uppercase tracking-widest font-bold CadillacGothic-Regular text-white/80">Email Address *</label>
              <input 
                type="email" 
                placeholder="Enter Your Email"
                required
                className="text-white bg-transparent border-b border-white/30 py-3 outline-none focus:border-white transition-colors CadillacGothic-Regular text-sm placeholder-white/50"
              />
            </div>

            {/* Space Requirement */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[11px] md:text-[13px] uppercase tracking-widest font-bold CadillacGothic-Regular text-white/80">Space Requirement (Approx Sq Ft) *</label>
              <input 
                type="text" 
                placeholder="e.g. 1500 Sq Ft"
                required
                className="text-white bg-transparent border-b border-white/30 py-3 outline-none focus:border-white transition-colors CadillacGothic-Regular text-sm placeholder-white/50"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[11px] md:text-[13px] uppercase tracking-widest font-bold CadillacGothic-Regular text-white/80">Your Message</label>
              <textarea 
                rows="3"
                placeholder="Tell us about your requirements..."
                className="text-white bg-transparent border-b border-white/30 py-3 outline-none focus:border-white transition-colors CadillacGothic-Regular text-sm resize-none placeholder-white/50"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 mt-4">
              <button className="w-full md:w-auto px-12 py-4 bg-black text-white uppercase text-[12px] md:text-[13px] tracking-widest font-bold transition-all duration-500 hover:bg-white hover:text-[#28659b] rounded-sm shadow-xl">
                Send Inquiry
              </button>
            </div>
          </form>
        </div>
      </section>
      {/* SECTION 3: CONTACT CTA */}
      <ContactCTA />
    </div>
  );
};

export default Leasing;