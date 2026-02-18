import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ctabg1 from "../assets/images/ctabg1.png";
import ameyalogo from "../assets/logo/ameya-logo.png";

// 1. FLOATING INPUT COMPONENT
const FloatingInput = ({ label, name, type = "text", required = false, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = (value || "").length > 0;

  return (
    <div id="enquiry-section" className={`relative border-b transition-all duration-500 ease-out 
      ${isFocused ? 'border-[#40a6ff]' : 'border-gray-300'} 
      group hover:border-gray-400`}
    >
      <motion.label
        initial={false}
        animate={{
          y: isFocused || hasValue ? -22 : 0,
          scale: isFocused || hasValue ? 0.8 : 1,
          color: "#fff",
          letterSpacing: isFocused || hasValue ? "0.2em" : "0.1em"
        }}
        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
        className="absolute left-0 top-3 text-[11px] md:text-[12px] uppercase pointer-events-none origin-left font-medium tracking-relaxed CadillacGothic-Regular"
      >
        {label} {required && <span className="text-[#ffffff]">*</span>}
      </motion.label>
      
      <input
        type={type}
        name={name}
        value={value} 
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={onChange}
        autoComplete="off"
        className="w-full bg-transparent outline-none text-[12px] tracking-relaxed text-white pt-5 pb-2 font-semibold CadillacGothic-Regular"
      />

      <motion.div 
        className="absolute bottom-0 left-0 h-[1.5px] bg-[#40a6ff] z-10"
        initial={{ width: 0 }}
        animate={{ width: isFocused ? "100%" : "0%" }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

const ContactCTA = () => {
  const sectionRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    purpose: 'General Inquiry',
    message: ''
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.phone.length < 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    console.log("Form Submitted:", formData);
    alert("Thank you! Your request has been sent.");
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen lg:min-h-[90vh] flex items-center justify-center py-16 md:py-24 overflow-hidden" id="Inquire"
    >
      {/* Parallax Background */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
        <img 
          src={ctabg1} 
          alt="Office Background" 
          className="w-full h-full object-cover scale-110"
        />
      </motion.div>
      <div className="absolute inset-0 z-10 bg-gradient-to-b lg:bg-gradient-to-r from-[#000000]/100 via-[#000000e5]/90 to-[#00000090]" />

      <div className="relative z-20 max-w-[1450px] mx-auto w-full px-6 md:px-12 lg:px-12 xl:px-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 xl:gap-16 items-start lg:items-center">
          
          {/* Left Content Side */}
          <div className="w-full lg:w-[60%] text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 md:mb-8"
            >
              <img 
                src={ameyalogo} 
                alt="Ameya Group Logo" 
                className="h-12 md:h-16 lg:h-18 w-auto object-contain" 
              />
            </motion.div>

            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#40a6ff] CadillacGothic-Regular text-[12px] md:text-[14px] tracking-[2.2px] uppercase font-bold mb-4 block"
            >
              Contact Us
            </motion.span>
            
            <h2 className="text-3xl md:text-4xl lg:text-[34px] xl:text-[48px] font-serif leading-[1.2] lg:leading-[1.1] mb-8 PlayfairDisplay">
              Connect. Collaborate. <br className="hidden md:block" /> 
              <span className="font-light text-[#ffffff] tracking-[1.2px]">Create Growth.</span>
            </h2>

            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row lg:flex-col xl:flex-row gap-8 md:gap-12">
              <div className="flex flex-col gap-1">
                <span className="text-white/60 text-[10px] md:text-[11px] tracking-[0.3em] uppercase CadillacGothic-WideRegular">Call Us</span>
                <a href="tel:+911242571477" className="text-[20px] md:text-[24px] tracking-relaxed text-white CadillacGothic-Regular mt-1 hover:text-[#40a6ff] transition-colors">+91-124-2571477</a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white/60 text-[10px] md:text-[11px] tracking-[0.3em] uppercase CadillacGothic-WideRegular">Mail Us</span>
                <a href="mailto:info@ameyagroup.in" className="text-[20px] md:text-[24px] tracking-relaxed text-white CadillacGothic-Regular mt-1 hover:text-[#40a6ff] transition-colors">info@ameyagroup.in</a>
              </div>
            </div>
          </div>

          {/* Right Form Side */}
          <div className="w-full lg:w-[400px] xl:w-[450px] bg-[#28659b]/95 backdrop-blur-md p-6 md:p-10 rounded-sm shadow-2xl">
            <form className="space-y-5 md:space-y-6 text-white" onSubmit={handleSubmit}>
  
  <FloatingInput 
    label="Full Name" 
    name="name" 
    value={formData.name} 
    onChange={handleChange} 
    required 
  />

  {/* Reduced gap from 8/10 to 5/6 */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5 md:gap-6">
    <FloatingInput 
      label="Email Address" 
      name="email" 
      type="email" 
      value={formData.email} 
      onChange={handleChange} 
      required 
    />
    <FloatingInput 
      label="Phone Number" 
      name="phone" 
      type="tel" 
      value={formData.phone} 
      onChange={handleChange} 
      required 
    />
  </div>

  <div className="relative border-b border-gray-300 pb-1">
    <label className="text-[11px] md:text-[12px] tracking-[1.6px] text-white/80 uppercase block mb-0 CadillacGothic-Regular">
      Inquiry Purpose
    </label>
    <select 
      name="purpose"
      value={formData.purpose}
      className="w-full bg-transparent py-1.5 text-[11px] tracking-[1.6px] outline-none appearance-none cursor-pointer font-bold text-white CadillacGothic-Regular"
      onChange={handleChange}
    >
      <option value="General Inquiry" className="text-black">GENERAL INQUIRY</option>
      <option value="Leasing & Retail" className="text-black">LEASING & RETAIL SPACES</option>
      <option value="Residential Booking" className="text-black">RESIDENTIAL BOOKING</option>
      <option value="Investment Opportunities" className="text-black">INVESTMENT OPPORTUNITIES</option>
      <option value="Corporate Partnerships" className="text-black">CORPORATE PARTNERSHIPS</option>
      <option value="Press & Media" className="text-black">PRESS & MEDIA</option>
    </select>
    <div className="absolute right-0 bottom-3 pointer-events-none text-[8px] text-[#ffffff]">▼</div>
  </div>

  <FloatingInput 
    label="Your Message" 
    name="message" 
    value={formData.message} 
    onChange={handleChange} 
  />

  <button 
    type="submit"
    className="group relative w-full overflow-hidden border border-white py-4 text-[10px] md:text-[11px] tracking-[1.2px] uppercase font-bold transition-all duration-500 Ameyasans-WideMedium mt-2"
  >
    <span className="relative z-10 group-hover:text-white transition-colors duration-500">
      Request a Callback
    </span>
    <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />
  </button> 
</form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;