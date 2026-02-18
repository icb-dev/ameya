import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Image as ImageIcon, Video as VideoIcon, Plus, Maximize2, X } from 'lucide-react';

const ALL_IMAGES = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000",
  "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=1000",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000",
];

const ALL_VIDEOS = [
  { id: 1, thumb: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000", title: "Exterior Walkthrough", url: "https://www.youtube.com/embed/-CO3DEfXPYU" },
  { id: 2, thumb: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000", title: "Interior Concept", url: "https://www.youtube.com/embed/-CO3DEfXPYU" },
];

const Residentialgallery = () => {
  const [activeTab, setActiveTab] = useState('IMAGES');
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedItem, setSelectedItem] = useState(null); // Lightbox State

  const loadMore = () => setVisibleCount(prev => prev + 3);

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-[1450px] mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold mb-4 text-[#40a6ff] CadillacGothic-Regular">
            Visual Experience
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-4xl md:text-[48px] font-serif PlayfairDisplay text-black tracking-tight">
            Sapphire Residences Gallery
          </motion.h2>
        </div>

        {/* TABS */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-gray-100 p-1.5 rounded-full relative">
            {['IMAGES', 'VIDEOS'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setVisibleCount(3); }}
                className={`relative z-10 px-10 py-3 text-[14px] font-bold uppercase tracking-[0.2em] transition-colors duration-500 flex items-center gap-2 CadillacGothic-Regular ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-black'}`}
              >
                {tab === 'IMAGES' ? <ImageIcon size={18} /> : <VideoIcon size={18} />}
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeGalTab" className="absolute inset-0 bg-[#28659b] rounded-full -z-10 shadow-lg" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          {activeTab === 'IMAGES' ? (
            <motion.div key="img-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ALL_IMAGES.slice(0, visibleCount).map((img, i) => (
                  <motion.div 
                    key={i} layout 
                    onClick={() => setSelectedItem({ type: 'image', src: img })}
                    className="group relative aspect-square rounded-[2rem] overflow-hidden bg-gray-50 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
                  >
                    <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm">
                      <div className="w-14 h-14 bg-white/20 border border-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white"><Maximize2 size={20} /></div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {visibleCount < ALL_IMAGES.length && (
                <div className="flex justify-center mt-12">
                  <button onClick={loadMore} className="group relative overflow-hidden px-14 py-5 bg-[#28659b] text-white text-[16px] font-bold uppercase tracking-wide rounded-full CadillacGothic-Regular transition-all active:scale-95">
                    <span className="relative z-10 flex items-center gap-3">Load More Images <Plus size={22} /></span>
                    <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="vid-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ALL_VIDEOS.map((vid, i) => (
                <div key={i} onClick={() => setSelectedItem({ type: 'video', src: vid.url })} className="group relative aspect-video rounded-[2.5rem] overflow-hidden bg-black shadow-2xl cursor-pointer">
                  <img src={vid.thumb} alt="Video thumb" className="w-full h-full object-cover opacity-60 transition-opacity group-hover:opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white group-hover:bg-[#40a6ff] group-hover:scale-110 transition-all duration-500"><Play fill="currentColor" size={28} className="ml-1" /></div>
                  </div>
                  <div className="absolute bottom-8 left-8"><h4 className="text-white text-[34px] font-bold PlayfairDisplay tracking-tight">{vid.title}</h4></div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* LIGHTBOX OVERLAY */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
              onClick={() => setSelectedItem(null)}
            >
              <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors"><X size={40} /></button>
              
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-5xl w-full max-h-[80vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedItem.type === 'image' ? (
                  <img src={selectedItem.src} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" alt="Preview" />
                ) : (
                  <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black">
                    <iframe src={selectedItem.src} className="w-full h-full" allow="autoplay; fullscreen" allowFullScreen title="Video Player" />
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Residentialgallery;