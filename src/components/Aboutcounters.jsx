import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import ctabg2 from '../assets/images/ctabg2.png';

const CounterItem = ({ target, label, index, total, customStyles }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, parseInt(target), { duration: 2, ease: "easeOut" });
      return controls.stop;
    } else {
      count.set(0);
    }
  }, [isInView, target, count]);

  return (
    <motion.div
      ref={ref}
      initial={{ rotateY: 90, opacity: 0 }}
      whileInView={{ rotateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`group relative flex flex-col items-center justify-center p-10 md:p-12 lg:p-14 cursor-pointer hover:bg-[#28659b] transition-colors duration-300 h-full
        border-white/10 border-b last:border-b-0
        md:nth-child(odd):border-r md:last:border-b-0
        lg:border-b-0 lg:border-r lg:last:border-r-0 lg:border-white/20
        ${index === total - 1 ? 'md:col-span-2 lg:col-span-1' : ''}`}
    >
      <div className="text-5xl mx-auto md:text-6xl font-serif font-bold text-white mb-4 CadillacGothic-Regular tracking-tight">
        <motion.span>{rounded}</motion.span>+
      </div>

      {/* Manual Formatting Controls applied here */}
      <div 
        className={`text-white/80 font-bold uppercase tracking-[2px] text-center group-hover:text-white transition-colors duration-300 CadillacGothic-Regular leading-relaxed
        ${customStyles.mobileSize || 'text-[11px]'} 
        ${customStyles.tabletSize || 'md:text-[13px]'} 
        ${customStyles.desktopSize || 'lg:text-[13px]'}
        ${customStyles.mobileWidth || 'max-w-[200px]'}
        ${customStyles.tabletWidth || 'md:max-w-[220px]'}
        ${customStyles.desktopWidth || 'lg:max-w-[none]'}`}
      >
        {label}
      </div>
    </motion.div>
  );
};

const Aboutcounters = () => {
  const [counters, setCounters] = useState([
    { 
        value: "5", 
        label: "Delivered Projects",
        styles: {
            mobileWidth: "max-w-[100%]", 
            tabletWidth: "md:max-w-[100%]",
            desktopWidth: "lg:max-w-[100%]",
            mobileSize: "text-[12px]",
        }
    },
    { 
        value: "5", 
        label: "Ongoing Development",
        styles: {
             mobileWidth: "max-w-[100%]", 
            tabletWidth: "md:max-w-[100%]",
            desktopWidth: "lg:max-w-[100%]",
            mobileSize: "text-[12px]",
        }
    },
    { 
        value: "3000", 
        label: "Satisfied Customers",
        styles: {
             mobileWidth: "max-w-[100%]", 
            tabletWidth: "md:max-w-[100%]",
            desktopWidth: "lg:max-w-[100%]",
            mobileSize: "text-[12px]",
        }
    },
    { 
        value: "100", 
        label: "Brand Partnerships",
        styles: {
             mobileWidth: "max-w-[100%]", 
            tabletWidth: "md:max-w-[100%]",
            desktopWidth: "lg:max-w-[100%]",
            mobileSize: "text-[12px]",
        }
    },
  ]);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/about/`);
        const data = await response.json();
        
        console.log('Fetched about data:', data);
        
        const aboutData = Array.isArray(data) ? data[0] : data;
        
        if (aboutData) {
          setCounters([
            { 
                value: aboutData.delivered_projects, 
                label: "Delivered Projects",
                styles: {
                    mobileWidth: "max-w-[100%]", 
                    tabletWidth: "md:max-w-[100%]",
                    desktopWidth: "lg:max-w-[100%]",
                    mobileSize: "text-[12px]",
                }
            },
            { 
                value: aboutData.ongoing_development, 
                label: "Ongoing Development",
                styles: {
                     mobileWidth: "max-w-[100%]", 
                    tabletWidth: "md:max-w-[100%]",
                    desktopWidth: "lg:max-w-[100%]",
                    mobileSize: "text-[12px]",
                }
            },
            { 
                value: aboutData.satisfied_customers, 
                label: "Satisfied Customers",
                styles: {
                     mobileWidth: "max-w-[100%]", 
                    tabletWidth: "md:max-w-[100%]",
                    desktopWidth: "lg:max-w-[100%]",
                    mobileSize: "text-[12px]",
                }
            },
            { 
                value: aboutData.brand_partnerships, 
                label: "Brand Partnerships",
                styles: {
                     mobileWidth: "max-w-[100%]", 
                    tabletWidth: "md:max-w-[100%]",
                    desktopWidth: "lg:max-w-[100%]",
                    mobileSize: "text-[12px]",
                }
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <section className="relative py-0 overflow-hidden min-h-[400px] flex items-center bg-black">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-60"
          style={{ backgroundImage: `url(${ctabg2})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black/60" />
      </div>

      <div className="relative z-10 w-full max-w-[1550px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-y border-white/10 lg:border-none">
          {counters.map((item, index) => (
            <CounterItem 
              key={index} 
              index={index}
              total={counters.length}
              target={item.value} 
              label={item.label} 
              customStyles={item.styles || {}} // Passing the manual controls
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Aboutcounters;