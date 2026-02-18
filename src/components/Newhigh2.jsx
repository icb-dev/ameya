import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Diamond, 
  Stethoscope, 
  ShoppingBag, 
  ShieldCheck,
  Car,
  Droplets,
  ArrowUpFromDot
} from 'lucide-react';

const highlightData = [
  { id: 1, title: "Commercial Spaces", subtitle: "Grade-A Workspaces", icon: Building2 },
  { id: 2, title: "Modern Facade", subtitle: "Iconic Architecture", icon: Diamond },
  { id: 3, title: "Medizone Floor", subtitle: "Wellness Hub", icon: Stethoscope },
  { id: 4, title: "Retail Zone", subtitle: "High-Street Experience", icon: ShoppingBag },
  { id: 5, title: "24x7 Security", subtitle: "Smart Surveillance", icon: ShieldCheck },
  { id: 6, title: "Ample Parking", subtitle: "Hassle-Free Arrival", icon: Car },
  { id: 7, title: "Water Management", subtitle: "Sustainable Utility", icon: Droplets },
  { id: 8, title: "Vertical Access", subtitle: "Seamless Flow", icon: ArrowUpFromDot }
];

const Newhigh2 = ({ highlightsSection }) => {
  // Map API data for the list, but we only use one static image now
  const getHighlightsData = () => {
    if (highlightsSection?.highlights && Array.isArray(highlightsSection.highlights)) {
      return highlightsSection.highlights.map((highlight, idx) => ({
        id: idx + 1,
        title: highlight,
        subtitle: highlight,
        icon: highlightData[idx % highlightData.length].icon,
      }));
    }
    return highlightData;
  };

  const displayData = getHighlightsData();
  // Static image from backend or fallback
  const staticImage = highlightsSection?.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200";

  return (
    <section className="w-full h-auto lg:h-screen bg-[#f1f8ff] flex flex-col lg:flex-row overflow-x-hidden">
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #28659b; border-radius: 10px; }
      `}} />

      {/* --- Static Image Area (Right Column) --- */}
      <div className="w-full lg:w-1/2 h-[45vh] sm:h-[50vh] md:h-[55vh] lg:h-full relative bg-slate-900 overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0">
          <img 
            src={staticImage} 
            alt="Project Highlight"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60" />
        </div>
      </div>

      {/* --- Static Navigation Area (Left Column) --- */}
      <div className="w-full lg:w-1/2 p-6 pt-16 sm:p-10 md:p-14 lg:p-8 xl:p-16 flex flex-col justify-center bg-[#f1f8ff] relative z-20 order-2 lg:order-1 overflow-x-hidden">
        <header className="mb-6 md:mb-10">
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-[#28659b] font-bold tracking-[0.2em] text-[12px] md:text-[14px] uppercase mb-2 CadillacGothic-Regular"
          >
            Explore Features
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="xs:text-[18px] text-[26px] md:text-[34px] lg:text-[32px] xl:text-[48px] tracking-tight font-serif text-slate-900 leading-tight"
          >
            Project Highlights
          </motion.h2>
        </header>

        {/* Static List Container (Non-clickable) */}
        <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 max-w-full custom-scrollbar py-2 max-h-[450px] sm:max-h-[500px] lg:max-h-none overflow-x-hidden">
          {displayData.map((item) => (
            <div
              key={item.id}
              className="w-full lg:w-[95%] flex items-center p-3 sm:p-4 md:p-6 lg:p-4 rounded-xl md:rounded-2xl border bg-white border-slate-100"
            >
              <div className="p-2.5 sm:p-3 rounded-lg md:rounded-xl mr-3 sm:mr-5 bg-slate-100 text-[#28659b] flex-shrink-0">
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-[15px] sm:text-[16px] md:text-[18px] CadillacGothic-Regular font-bold text-slate-800">
                  {item.title}
                </h4>
                {/* <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-wide truncate">
                  {item.subtitle}
                </p> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Newhigh2;