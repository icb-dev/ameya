import React from 'react';
import { motion } from 'framer-motion';
// Added missing icon imports to fix the "not defined" errors
import { 
  Building2, 
  ShieldCheck, 
  Train, 
  Globe, 
  MapPin, 
  TreePine, 
  ArrowUpRight 
} from 'lucide-react';

const Projectlocations = ({ project, projectTitle }) => {
  // Default project data fallback
  const defaultMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3509.324838573216!2d77.0560!3d28.4080!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI0JzI4LjgiTiA3N8KwMDMnMjEuNiJF!5e0!3m2!1sen!2sin!4v1625000000000!5m2!1sen!2sin";
  
  const projectData = project || {};
  
  // Get map URL from various possible locations
  let mapUrl = projectData.location?.mapUrl || 
               projectData.location?.map_url || 
               defaultMapUrl;
  
  // Validate map URL - if it doesn't look like a valid embed URL, use default
  if (!mapUrl || 
      (!mapUrl.startsWith('http') && !mapUrl.startsWith('//')) ||
      mapUrl.includes('.js') || 
      mapUrl.length < 20) {
    console.warn('Invalid map URL from backend:', mapUrl, 'Using default');
    mapUrl = defaultMapUrl;
  }
  
  const locations = projectData.location?.locations || [];
  
  // Debug log to see what we're getting
  console.log('Projectlocations - project:', project);
  console.log('Projectlocations - mapUrl:', mapUrl);
  console.log('Projectlocations - locations:', locations);

  return (
    <section className="py-16 md:py-24 lg:py-36 bg-[#28659b] text-white overflow-hidden">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6">
        
        {/* 1. Header Section */}
        <div className="text-center mb-10 md:mb-20">
          <motion.p 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            className="text-[10px] md:text-[12px] uppercase tracking-[0.3em] md:tracking-[0.5em] text-white font-bold mb-4 CadillacGothic-Regular"
          >
            Connectivity Hub
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            className="xs:text-[18px] text-[26px] md:text-[34px] lg:text-[32px] xl:text-[48px] font-serif PlayfairDisplay text-white tracking-tight leading-tight"
          >
            {projectTitle ? `${projectTitle} ` : ''} Location Advantage
          </motion.h2>
        </div>

        {/* 2. Responsive Grid Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-10 gap-8 md:gap-12 items-start">
          
          {/* 3. Cinematic Map (Top on mobile/tablet, right on desktop) */}
          <div className="w-full lg:col-span-6 order-1 lg:order-2 lg:sticky lg:top-10">
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] rounded-[1rem] overflow-hidden border border-white/10 bg-neutral-900 shadow-[0_0_60px_rgba(0,0,0,0.4)]">
              {mapUrl && mapUrl.startsWith('http') ? (
                <iframe 
                  src={mapUrl} 
                  title="Location Map" 
                  className="w-full h-full opacity-90 contrast-125 transition-all duration-1000" 
                  allowFullScreen="" 
                  loading="lazy"
                  frameBorder="0"
                  style={{ border: 0 }}
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-white/50">
                  <p className="text-sm">Map URL not available</p>
                </div>
              )}
              
              <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8">
                <button className="group relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 hover:border-[#40a6ff] px-5 py-3 md:px-8 md:py-4 rounded-full transition-all duration-500">
                  <span className="relative z-10 text-[9px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-white group-hover:text-black transition-colors CadillacGothic-Regular">Open Navigation</span>
                  <div className="absolute inset-0 bg-[#40a6ff] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </button>
              </div>
            </div>
          </div>

          {/* 4. Connectivity Cards (Below map on mobile, left on desktop) */}
          <div className="w-full lg:col-span-4 h-auto lg:h-[550px] lg:overflow-y-auto lg:pr-6 order-2 lg:order-1 custom-location-scroll group/container">
            <div className="flex flex-col gap-3 md:gap-4">
              {(locations.length > 0 ? locations.map(loc => ({
                point: loc.name || loc.place || "",
                distance: loc.distance_time || loc.time || loc.distance || "",
                icon: Building2
              })) : [
                { point: "Golf Course Ext. Road", distance: "2 Mins Drive", icon: Building2 },
                { point: "NH-8 Expressway", distance: "10 Mins Drive", icon: Building2 },
                { point: "Proposed Metro Station", distance: "5 Mins Walk", icon: Train },
                { point: "Medanta Medicity", distance: "12 Mins Drive", icon: ShieldCheck },
                { point: "IGI Airport", distance: "30 Mins Drive", icon: Globe },
                { point: "Cyber City", distance: "20 Mins Drive", icon: Building2 },
                { point: "Sohna Road", distance: "5 Mins Drive", icon: MapPin },
                { point: "Artemis Hospital", distance: "08 Mins Drive", icon: ShieldCheck },
                { point: "Huda City Centre", distance: "15 Mins Drive", icon: Train },
                { point: "Tau Devi Lal Park", distance: "05 Mins Drive", icon: TreePine }
              ]).map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className={`flex items-center gap-4 md:gap-6 p-4 md:p-5 rounded-2xl border transition-all duration-500 group cursor-pointer
                    ${i % 2 === 0 
                      ? 'bg-white/[0.03] border-white/10 hover:border-white/40 hover:bg-white/[0.06]' 
                      : 'bg-[#40a6ff]/[0.05] border-[#40a6ff]/20 hover:border-[#40a6ff]/50 hover:bg-[#40a6ff]/[0.08]'
                    }`}
                >
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 transform group-hover:scale-110
                    ${i % 2 === 0 
                      ? 'bg-white/10 text-white group-hover:bg-white group-hover:text-black' 
                      : 'bg-white/10 text-white group-hover:bg-white group-hover:text-black shadow-[0_0_25px_rgba(64,166,255,0.3)]'}`}
                  >
                    <item.icon size={22} className="md:w-[28px]" strokeWidth={1.5} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="text-[16px] md:text-xl tracking-tight text-white transition-colors CadillacGothic-Regular">
                      {item.point}
                    </h5>
                    <p className={`text-[11px] md:text-[14px] CadillacGothic-Regular tracking-relaxed uppercase font-bold mt-1 
                      ${i % 2 === 0 ? 'text-white/90' : 'text-white'}`}>
                      {item.distance}
                    </p>
                  </div>

                  <div className="hidden sm:block opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    <ArrowUpRight size={24} className="text-white" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-location-scroll::-webkit-scrollbar { width: 4px; }
        .custom-location-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-location-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-location-scroll:hover::-webkit-scrollbar-thumb { background: #40a6ff; }
        @media (max-width: 1023px) {
          .custom-location-scroll { overflow-y: visible !important; height: auto !important; }
        }
      `}} />
    </section>
  );
};

export default Projectlocations;