import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Diamond, 
  Stethoscope, 
  ArrowUpFromDot, 
  ShoppingBag, 
  ChevronsRight, 
  Car, 
  ShieldCheck, 
  Droplets, 
  ArrowUpRight 
} from 'lucide-react';

// --- Configuration Data ---
const highlights = [
  {
    id: 1,
    title: "Commercial Development",
    value: "1.80 Lakh",
    unit: "Sq. Ft.",
    icon: Building2,
    description: "Premium Grade-A office spaces designed for global businesses.",
    colSpan: "md:col-span-2", 
    delay: 0.1
  },
  {
    id: 2,
    title: "Architectural Marvel",
    value: "Modern",
    unit: "Facade",
    icon: Diamond,
    description: "Contemporary glass facade ensuring natural light.",
    colSpan: "md:col-span-1",
    delay: 0.2
  },
  {
    id: 3,
    title: "Medizone Floor",
    value: "35,000",
    unit: "Sq. Ft.",
    icon: Stethoscope,
    description: "Dedicated healthcare zone for wellness centers.",
    colSpan: "md:col-span-1",
    delay: 0.3
  },
  {
    id: 4,
    title: "Vertical Access",
    value: "Dedicated",
    unit: "Escalator",
    icon: ArrowUpFromDot,
    description: "Seamless connectivity across floors.",
    colSpan: "md:col-span-1",
    delay: 0.4
  },
  {
    id: 5,
    title: "Retail Zone",
    value: "1.35 Lakh",
    unit: "Sq. Ft.",
    icon: ShoppingBag,
    description: "High-street retail experience with premium brand visibility.",
    colSpan: "md:col-span-2",
    delay: 0.5
  },
  {
    id: 6,
    title: "Travelator",
    value: "High-Speed",
    unit: "Access",
    icon: ChevronsRight,
    description: "Advanced mobility solutions.",
    colSpan: "md:col-span-1",
    delay: 0.6
  },
  {
    id: 7,
    title: "Hassle-Free",
    value: "Ample",
    unit: "Parking",
    icon: Car,
    description: "Multi-level parking facility.",
    colSpan: "md:col-span-1",
    delay: 0.7
  },
  {
    id: 8,
    title: "CCTV Security",
    value: "24x7",
    unit: "Secured",
    icon: ShieldCheck,
    description: "Advanced surveillance systems.",
    colSpan: "md:col-span-1",
    delay: 0.8
  },
  {
    id: 9,
    title: "Sustainable",
    value: "Water",
    unit: "Supply",
    icon: Droplets,
    description: "Eco-friendly management.",
    colSpan: "md:col-span-1",
    delay: 0.9
  }
];

// --- Card Component ---
const HighlightCard = ({ item }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: item.delay }}
      viewport={{ once: true }}
      className={`shadow-[0_10px_30px_rgba(0,0,0,0.25)] group relative overflow-hidden rounded-3xl bg-white p-8 border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-blue-100 ${item.colSpan}`}
    >
      {/* Background Hover Effect */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Header: Icon & Tag */}
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 rounded-2xl bg-slate-50 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
            <item.icon className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded-md">
            {item.title}
          </span>
        </div>

        {/* Content */}
        <div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3 className="text-3xl font-serif font-medium text-slate-900 group-hover:text-blue-900 transition-colors duration-300">
              {item.value}
            </h3>
            <span className="text-lg font-medium text-blue-600">
              {item.unit}
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed font-medium">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Section ---
const Newhigh = () => {
  return (
    <section className="relative w-full bg-[#F8FAFC] py-24 px-4 sm:px-6 lg:px-0">
      
      {/* Background Texture (Subtle Grid) */}
      <div className="absolute inset-0 opacity-[0.4]" 
           style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="w-[1450px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 md:flex md:items-end md:justify-between">
          <div className="max-w-2xl">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               className="flex items-center gap-2 mb-4"
            >
               <span className="h-px w-8 bg-blue-600"></span>
               <span className="text-blue-700 font-bold tracking-wider text-sm uppercase">Project Highlights</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight"
            >
              The New Standard of <br/>
              <span className="italic text-slate-400">Excellence.</span>
            </motion.h2>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden md:block text-slate-500 max-w-sm text-sm leading-relaxed"
          >
            Sapphire57 brings together the finest elements of design, functionality, and sustainability in one iconic location.
          </motion.p>
        </div>

        {/* The Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {highlights.map((item) => (
            <HighlightCard key={item.id} item={item} />
          ))}

          {/* Call to Action Card (Last Item) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
            className="group relative cursor-pointer overflow-hidden rounded-3xl bg-blue-900 p-8 md:col-span-1 flex flex-col justify-between shadow-2xl shadow-blue-900/20"
          >
             {/* Decorative Background Circles */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-800/50 rounded-full blur-3xl group-hover:bg-blue-700/50 transition-colors" />
             
             <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm group-hover:bg-white group-hover:text-blue-900 text-white transition-all duration-300">
                    <ArrowUpRight size={24} />
                </div>
                <h3 className="text-2xl font-serif text-white mb-2">Explore <br/>Details</h3>
                <p className="text-blue-200 text-xs mb-6 opacity-80">Download brochure & plans.</p>
             </div>
             
             <div className="relative z-10 flex items-center gap-2 text-white font-semibold text-sm group-hover:translate-x-2 transition-transform">
                <span>View More</span>
                <ChevronsRight size={16} />
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newhigh;