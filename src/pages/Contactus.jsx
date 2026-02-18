import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

// Asset Import
import contactBanner from "../assets/images/contactimg1.jpg"; 

const BANNER_IMAGES = [contactBanner];

const Contactus = () => {
  const [currentImg, setCurrentImg] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Handle screen resize for hover effects
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 5000);
    
    return () => {
        clearInterval(timer);
        window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div className="bg-[#f0f2f5] min-h-screen selection:bg-[#28659b] selection:text-white overflow-x-hidden">
      
      {/* SECTION 1: CINEMATIC BANNER - Font Size Adjusted */}
      <section className="relative h-[40vh] md:h-[65vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImg}
              src={BANNER_IMAGES[currentImg]}
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full object-cover"
              alt="Ameya Architecture"
            />
          </AnimatePresence>
          <div className="absolute inset-0 z-[5] bg-black/40" />
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-4xl md:text-6xl lg:text-8xl font-serif PlayfairDisplay tracking-tighter"
          >
            Get In <span className="italic text-[#3a8dd6]">Touch.</span>
          </motion.h1>
        </div>
      </section>

      {/* SECTION 2: 3D HORIZONTAL CONTACT CENTER */}
      <section className="relative z-30 -mt-16 md:-mt-24 px-4 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-0 perspective-1500">
            
            {/* LEFT: PHONE NO. */}
            <motion.div 
              whileHover={!isMobile ? { rotateY: 0, z: 50, scale: 1.05 } : { scale: 1.02 }}
              className="w-full lg:w-1/4 bg-white p-8 shadow-xl border border-gray-100 flex flex-col justify-center items-center text-center transition-all duration-500 rounded-2xl lg:rounded-r-none lg:rotate-y-12 origin-right"
            >
              <div className="p-3 bg-blue-50 rounded-full mb-4">
                <Phone className="text-[#28659b]" size={28} />
              </div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-600 mb-6 CadillacGothic-Regular">Voice Line</h3>
              <div className="text-[15px] CadillacGothic-Regular text-black font-semibold">
                <p>+91 124 2571477</p>
                <p>+91 9711004269</p>
              </div>
            </motion.div>

            {/* MIDDLE: CORPORATE OFFICE */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="w-full lg:w-[35%] bg-white p-10 md:p-12 shadow-[0_40px_80px_rgba(0,0,0,0.15)] z-40 border-t-8 border-[#28659b] rounded-2xl text-center relative"
            >
              <MapPin className="text-[#28659b] mx-auto mb-6 animate-pulse" size={40} />
              <h2 className="text-2xl md:text-3xl font-serif PlayfairDisplay text-black mb-2">Ameya Group</h2>
              <p className="text-[#3a8dd6] text-[12px] uppercase tracking-[0.4em] mb-6 CadillacGothic-Regular font-bold">Corporate Office</p>
              <address className="not-italic text-gray-700 CadillacGothic-Regular leading-relaxed text-[14px] md:text-[16px]">
                Ameya One, Golf Course Road, DLF City V<br />
                Sector 42, Gurgaon – 122002, Haryana, India
              </address>
            </motion.div>

            {/* RIGHT: MAIL */}
            <motion.div 
              whileHover={!isMobile ? { rotateY: 0, z: 50, scale: 1.05 } : { scale: 1.02 }}
              className="w-full lg:w-1/4 bg-white p-8 shadow-xl border border-gray-100 flex flex-col justify-center items-center text-center transition-all duration-500 rounded-2xl lg:rounded-l-none lg:-rotate-y-12 origin-left"
            >
              <div className="p-3 bg-blue-50 rounded-full mb-4">
                <div className="p-3 bg-blue-50 rounded-full mb-4">
                    <Mail className="text-[#28659b]" size={28} />
                </div>
              </div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-600 mb-6 CadillacGothic-Regular">Email Inquiries</h3>
              <div className="text-[15px] CadillacGothic-Regular text-black font-semibold">
                <p>info@ameyagroup.in</p>
                <p>sales@ameyagroup.in</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 3: HIGH-VISIBILITY 3D FORM */}
      <section className="py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-[1000px] mx-auto">
          <div className="bg-white rounded-[30px] md:rounded-[50px] p-8 md:p-20 shadow-[0_30px_100px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden relative">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#28659b]/5 rounded-bl-full pointer-events-none" />

            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif PlayfairDisplay text-black">Drop Us a Message</h2>
              <p className="text-gray-800 mt-4 CadillacGothic-Regular tracking-widest text-[12px] uppercase">Tailoring Excellence for You</p>
            </div>

            <form className="space-y-8 md:space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="relative group">
                  <input 
                    type="text" 
                    required
                    className="w-full bg-[#f8fafc] border-2 border-gray-400 rounded-2xl px-6 py-5 outline-none focus:border-[#28659b] focus:bg-white focus:shadow-[0_10px_30px_rgba(40,101,155,0.1)] transition-all text-black font-medium text-base CadillacGothic-Regular placeholder:text-gray-600"
                    placeholder="Full Name"
                  />
                </div>
                <div className="relative group">
                  <input 
                    type="email" 
                    required
                    className="w-full bg-[#f8fafc] border-2 border-gray-400 rounded-2xl px-6 py-5 outline-none focus:border-[#28659b] focus:bg-white focus:shadow-[0_10px_30px_rgba(40,101,155,0.1)] transition-all text-black font-medium text-base CadillacGothic-Regular placeholder:text-gray-600"
                    placeholder="Email Address"
                  />
                </div>
                <div className="relative group">
                  <input 
                    type="tel" 
                    required
                    className="w-full bg-[#f8fafc] border-2 border-gray-400 rounded-2xl px-6 py-5 outline-none focus:border-[#28659b] focus:bg-white focus:shadow-[0_10px_30px_rgba(40,101,155,0.1)] transition-all text-black font-medium text-base CadillacGothic-Regular placeholder:text-gray-600"
                    placeholder="Phone Number"
                  />
                </div>
                <div className="relative group">
                  <input 
                    type="text" 
                    className="w-full bg-[#f8fafc] border-2 border-gray-400 rounded-2xl px-6 py-5 outline-none focus:border-[#28659b] focus:bg-white focus:shadow-[0_10px_30px_rgba(40,101,155,0.1)] transition-all text-black font-medium text-base CadillacGothic-Regular placeholder:text-gray-600"
                    placeholder="Subject"
                  />
                </div>
              </div>

              <div className="relative group">
                <textarea 
                  rows="5" 
                  className="w-full bg-[#f8fafc] border-2 border-gray-400 rounded-2xl px-6 py-5 outline-none focus:border-[#28659b] focus:bg-white focus:shadow-[0_10px_30px_rgba(40,101,155,0.1)] transition-all text-black font-medium text-base CadillacGothic-Regular placeholder:text-gray-600 resize-none"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>

              {/* FIXED SUBMIT BUTTON - One line on mobile */}
              <div className="text-center">
                <button className="group relative w-full md:w-auto bg-[#28659b] text-white px-6 md:px-20 py-6 rounded-2xl text-[14px] md:text-[16px] uppercase tracking-normal md:tracking-[0.4em] font-bold shadow-[0_20px_40px_rgba(40,101,155,0.3)] hover:bg-black hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-300 overflow-hidden whitespace-nowrap">
                  <span className="relative z-10 flex items-center justify-center gap-3 md:gap-4 CadillacGothic-Regular">
                    Send Message <Send size={20} className="shrink-0" />
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* SECTION 4: LOCATION MAP */}
      <section className="px-4 md:px-10 pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center gap-4 mb-10">
                <span className="h-[1px] flex-1 bg-gray-300"></span>
                <h3 className="text-[12px] uppercase tracking-[0.5em] text-gray-400 CadillacGothic-Regular">Locate Us</h3>
                <span className="h-[1px] flex-1 bg-gray-300"></span>
            </div>
            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="w-full h-[400px] md:h-[600px] rounded-[30px] overflow-hidden shadow-2xl border-4 border-white"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.8103328228393!2d77.08638367448883!3d28.41162237578361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d2217144be6fd%3A0xb5b7f14b301725b8!2sAmeya%20One!5e0!3m2!1sen!2sin!4v1709722305041!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                title="Ameya Office Location"
                className="filter grayscale-[0.2] contrast-[1.1] hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </motion.div>
        </div>
      </section>

      <style jsx>{`
        .perspective-1500 {
          perspective: 1500px;
        }
        @media (min-width: 1024px) {
            .lg\:rotate-y-12 { transform: rotateY(15deg); }
            .lg\:-rotate-y-12 { transform: rotateY(-15deg); }
        }
      `}</style>

    </div>
  );
};

export default Contactus;