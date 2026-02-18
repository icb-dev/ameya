import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Fixed: Added necessary icon imports
import { Send, Plus, Minus } from 'lucide-react';

const Projectfaqform = ({ faqsSection }) => {
  // Changed -1 to 0 so the first item is open by default
  const [openFaq, setOpenFaq] = useState(0);

  // Map API data to component format
  const getFaqs = () => {
    if (faqsSection && faqsSection.items && Array.isArray(faqsSection.items)) {
      return faqsSection.items.map(item => ({
        q: item.question || "",
        a: item.answer || ""
      }));
    }
    return [
      { q: "What is the timeline for project possession?", a: "The project is on track for completion by the scheduled date with rigorous quality checks." },
      { q: "Are the payment plans customizable?", a: "We offer tailored structures including CLP and PLP options for investment milestones." },
      { q: "Is the development RERA certified?", a: "Yes, the project is fully RERA compliant. All documentation is available at our experience center." },
      { q: "What security measures are in place?", a: "The property features 24/7 multi-tier security and biometric access controls." },
      { q: "Are there visitor parking facilities?", a: "Spacious multi-level basement parking is dedicated to visitors to ensure zero congestion." }
    ];
  };

  const faqs = getFaqs();

  return (
    <section className="py-24 md:py-28 bg-[#f1f8ff] overflow-hidden border-t border-gray-100">
      <div className="max-w-[1450px] mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-20 md:mb-24">
          <motion.p 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold mb-4 text-[#40a6ff] CadillacGothic-Regular"
          >
            Concierge Support
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-[48px] font-serif PlayfairDisplay text-black tracking-tighter"
          >
            Queries & Inquiry
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-start">
          
          {/* LEFT: MINIMAL ACCORDION */}
          <div className="space-y-1 CadillacGothic-Regular">
            {faqs.map((faq, index) => (
              <div key={index} className="group border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  className="w-full flex items-center justify-between py-6 text-left"
                >
                  <span className={`text-[16px] md:text-[22px] font-medium tracking-tight transition-colors duration-300 ${openFaq === index ? 'text-[#28659b]' : 'text-black/80 group-hover:text-black'}`}>
                    {faq.q}
                  </span>
                  <div className={`transition-transform duration-500 ${openFaq === index ? 'rotate-180 text-[#28659b]' : 'text-black/80'}`}>
                    {openFaq === index ? <Minus size={22} /> : <Plus size={22} />}
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="pb-6 text-gray-800 text-sm leading-relaxed max-w-xl CadillacGothic-Regular">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* RIGHT: COMPACT FORM */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            className="bg-[#28659b] p-10 md:p-12 rounded-[6px] shadow-2xl relative ml-0 lg:ml-20 xl:ml-40"
          >
            <h3 className="text-[26px] md:text-[34px] tracking-tight font-bold text-white mb-4 PlayfairDisplay">Personalized Inquiry</h3>
            
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}> 
              {[
                { id: 'f_name', label: 'Full Name', type: 'text' },
                { id: 'f_email', label: 'Email Address', type: 'email' },
                { id: 'f_phone', label: 'Phone Number', type: 'tel' }
              ].map((field) => (
                <div key={field.id} className="relative group">
                  <input 
                    type={field.type}
                    id={field.id}
                    placeholder=" "
                    className="peer w-full bg-transparent text-white px-0 py-4 border-b border-white/50 outline-none transition-all duration-300 
                    focus:border-[#fff] hover:border-white"
                  />
                  <label 
                    htmlFor={field.id}
                    className="absolute left-0 top-4 text-white text-sm transition-all duration-300 pointer-events-none 
                    peer-focus:-translate-y-4 peer-focus:text-[#fff] peer-focus:text-[10px]
                    peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:text-white peer-[:not(:placeholder-shown)]:text-[10px] CadillacGothic-Regular uppercase tracking-wider"
                  >
                    {field.label}
                  </label>
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#fff] transition-all duration-500 peer-focus:w-full"></div>
                </div>
              ))}

              <div className="relative group pt-2">
                <textarea 
                  id="f_message"
                  rows="2"
                  placeholder=" " 
                  className="peer w-full bg-transparent text-white px-0 py-4 border-b border-white/50 outline-none transition-all duration-300 focus:border-[#fff] hover:border-white resize-none"
                />
                <label 
                  htmlFor="f_message"
                  className="absolute left-0 top-4 text-white text-sm transition-all duration-300 pointer-events-none 
                  peer-focus:-translate-y-4 peer-focus:text-[#fff] peer-focus:text-[10px]
                  peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:text-white peer-[:not(:placeholder-shown)]:text-[10px] CadillacGothic-Regular uppercase tracking-wider"
                >
                  Your Message
                </label>
              </div>

              <button className="w-full mt-8 group relative overflow-hidden bg-white py-4 rounded-[4px] transition-all duration-500 hover:shadow-[0_10px_20px_rgba(64,166,255,0.2)]">
                <div className="absolute inset-0 bg-[#000] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 flex items-center justify-center gap-3 text-black group-hover:text-white font-bold uppercase tracking-wide text-[14px] md:text-[16px] CadillacGothic-Regular">
                  Send Inquiry <Send size={20} />
                </span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Projectfaqform;