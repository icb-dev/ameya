import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Image as ImageIcon, Video as VideoIcon, Plus, Maximize2, X } from 'lucide-react';

// const ALL_IMAGES = [
//   "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000",
//   "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000",
//   "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000",
//   "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=1000",
//   "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000",
//   "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000",
// ];

// const ALL_VIDEOS = [
//   { id: 1, thumb: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000", title: "Exterior Walkthrough", url: "https://www.youtube.com/embed/-CO3DEfXPYU" },
//   { id: 2, thumb: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000", title: "Interior Concept", url: "https://www.youtube.com/embed/-CO3DEfXPYU" },
// ];

const ProjectGallery = ({ gallerySection, mediaSection, projectTitle = "Sapphire57" }) => {
  // Map API data to component format
  const getImages = () => {
    if (gallerySection && gallerySection.images && Array.isArray(gallerySection.images) && gallerySection.images.length > 0) {
      return gallerySection.images;
    }
    return []; // Return empty if no admin data
  };

  const getVideos = () => {
    if (mediaSection && mediaSection.items && Array.isArray(mediaSection.items) && mediaSection.items.length > 0) {
      return mediaSection.items.map((item, idx) => {
        const url = item.url || "";
        const videoId = url.includes('youtube.com/watch?v=') 
          ? url.split('v=')[1]?.split('&')[0]
          : url.includes('youtu.be/')
          ? url.split('youtu.be/')[1]?.split('?')[0]
          : null;
        
        return {
          id: idx + 1,
          thumb: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ALL_VIDEOS[0].thumb,
          title: item.title || `Video ${idx + 1}`,
          url: videoId ? `https://www.youtube.com/embed/${videoId}` : url
        };
      });
    }
    return []; // Return empty if no admin data
  };

  const displayImages = getImages();
  const displayVideos = getVideos();

  // If NO data exists in both, hide the whole section
  if (displayImages.length === 0 && displayVideos.length === 0) return null;

  // Determine which tab to show first based on availability
  const initialTab = displayImages.length > 0 ? 'IMAGES' : 'VIDEOS';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedItem, setSelectedItem] = useState(null); 

  const loadMore = () => setVisibleCount(prev => prev + 3);

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6">
        
        {/* HEADER */}
        <div className="text-center mb-10 md:mb-16">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold mb-3 md:mb-4 text-[#40a6ff] CadillacGothic-Regular">
            Visual Experience
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} 
            className="xs:text-[22px] text-[28px] md:text-[34px] lg:text-[36px] xl:text-[48px] font-serif PlayfairDisplay text-black tracking-tight"
          >
            {projectTitle} Gallery
          </motion.h2>
        </div>

        {/* TABS - Only show if BOTH types of media exist */}
        {displayImages.length > 0 && displayVideos.length > 0 && (
          <div className="flex justify-center mb-10 md:mb-16">
            <div className="inline-flex bg-gray-100 p-1 md:p-1.5 rounded-full relative w-full sm:w-auto">
              {['IMAGES', 'VIDEOS'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setVisibleCount(3); }}
                  className={`relative z-10 flex-1 sm:flex-none px-6 md:px-10 py-2.5 md:py-3 text-[12px] md:text-[14px] font-bold uppercase tracking-[0.2em] transition-colors duration-500 flex items-center justify-center gap-2 CadillacGothic-Regular ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-black'}`}
                >
                  {tab === 'IMAGES' ? <ImageIcon size={16} className="md:w-[18px]" /> : <VideoIcon size={16} className="md:w-[18px]" />}
                  <span>{tab}</span>
                  {activeTab === tab && (
                    <motion.div layoutId="activeGalTab" className="absolute inset-0 bg-[#28659b] rounded-full -z-10 shadow-lg" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          {activeTab === 'IMAGES' && displayImages.length > 0 ? (
            <motion.div key="img-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {displayImages.slice(0, visibleCount).map((img, i) => (
                  <motion.div 
                    key={i} layout 
                    onClick={() => setSelectedItem({ type: 'image', src: img })}
                    className="group relative aspect-square rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-gray-50 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
                  >
                    <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 border border-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white"><Maximize2 size={20} /></div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {visibleCount < displayImages.length && (
                <div className="flex justify-center mt-10 md:mt-12">
                  <button onClick={loadMore} className="group relative overflow-hidden px-8 md:px-14 py-4 md:py-5 bg-[#28659b] text-white text-[14px] md:text-[16px] font-bold uppercase tracking-wide rounded-full CadillacGothic-Regular transition-all active:scale-95">
                    <span className="relative z-10 flex items-center gap-3">Load More Images <Plus size={20} /></span>
                    <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </button>
                </div>
              )}
            </motion.div>
          ) : activeTab === 'VIDEOS' && displayVideos.length > 0 ? (
            <motion.div key="vid-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {displayVideos.map((vid, i) => (
                <div key={i} onClick={() => setSelectedItem({ type: 'video', src: vid.url })} 
                  className="group relative aspect-video rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-black shadow-2xl cursor-pointer"
                >
                  <img src={vid.thumb} alt="Video thumb" className="w-full h-full object-cover opacity-60 transition-opacity group-hover:opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 md:w-20 md:h-20 bg-white/10 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white group-hover:bg-[#40a6ff] group-hover:scale-110 transition-all duration-500"><Play fill="currentColor" size={24} className="md:w-[28px] ml-1" /></div>
                  </div>
                  <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 pr-4">
                    <h4 className="text-white text-[20px] md:text-[28px] lg:text-[34px] font-bold PlayfairDisplay tracking-tight leading-tight">
                      {vid.title}
                    </h4>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* LIGHTBOX OVERLAY */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
              onClick={() => setSelectedItem(null)}
            >
              <button className="absolute top-5 right-5 md:top-10 md:right-10 text-white/50 hover:text-white transition-colors">
                <X size={32} className="md:w-[40px]" />
              </button>
              
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-5xl w-full max-h-[85vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedItem.type === 'image' ? (
                  <img src={selectedItem.src} className="max-w-full max-h-[80vh] object-contain rounded-lg md:rounded-xl shadow-2xl" alt="Preview" />
                ) : (
                  <div className="w-full aspect-video rounded-xl md:rounded-3xl overflow-hidden shadow-2xl bg-black">
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

export default ProjectGallery;