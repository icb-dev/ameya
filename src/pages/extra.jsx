
// property detialed page
{/* SECTION 4: AMENITIES */}
      <section className="py-24 md:py-32 bg-white overflow-hidden">
        <div className="max-w-[1450px] mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold mb-4 text-[#28659b] CadillacGothic-Regular">Amenities</p>
            <h2 className="text-4xl md:text-4xl font-serif leading-tight Ameyasans-WideMedium text-black tracking-[-2.2px] mb-8">Sapphire 57 Amenities</h2>
            <div className="relative flex bg-gray-100 p-1.5 rounded-full">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative z-10 px-8 py-3 text-[11px] font-bold tracking-widest transition-colors duration-300 uppercase CadillacGothic-Regular ${
                    activeTab === tab ? 'text-white' : 'text-black hover:text-[#28659b]'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-[#28659b] rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="relative mb-16">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }} 
                transition={{ duration: 0.5 }}
              >
                <Swiper 
                  onSwiper={(s) => (amenitySwiper.current = s)}
                  modules={[Navigation, Autoplay]} 
                  spaceBetween={30} 
                  slidesPerView={1.2} 
                  autoplay={{ delay: 4000, disableOnInteraction: false }} 
                  breakpoints={{ 640: { slidesPerView: 2.5 }, 1024: { slidesPerView: 4 } }} 
                  className="!overflow-visible"
                >
                  {project.categorizedAmenities[activeTab].map((item) => (
                    <SwiperSlide key={item.id}>
                      <div className="group cursor-pointer">
                        <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-md mb-4">
                          <motion.img 
                            src={item.img} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                        </div>
                        <h4 className="text-black text-sm font-bold tracking-widest uppercase CadillacGothic-Regular text-center">
                          {item.name}
                        </h4>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button onClick={() => amenitySwiper.current?.slidePrev()} className="p-4 border border-black/50 rounded-full hover:bg-black hover:text-white transition-all shadow-sm">
              <ChevronLeft size={20} />
            </button>
            <button className="relative group overflow-hidden px-14 py-5 bg-black text-white text-[12px] font-bold uppercase tracking-[0.3em] rounded-full transition-all shadow-xl CadillacGothic-Regular">
              <span className="relative z-10">Explore All Features</span>
              <div className="absolute inset-0 bg-[#28659b] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </button>
            <button onClick={() => amenitySwiper.current?.slideNext()} className="p-4 border border-black/50 rounded-full hover:bg-black hover:text-white transition-all shadow-sm">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: SITEPLAN & FLOOR PLANS */}
      <section className="py-24 md:py-32 bg-[#fcfcfc] overflow-hidden">
        <div className="max-w-[1450px] mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <SectionHeader 
               title="Sapphire 57 Design & Layout" 
               subtitle="Architecture & Plans" 
               center={true} 
            />
            <div className="relative flex bg-gray-200/50 p-1.5 rounded-full mt-[-20px]">
              {['SITEPLAN', 'FLOOR PLANS'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivePlanTab(tab)}
                  className={`relative z-10 px-10 py-3 text-[14px] font-bold tracking-widest transition-colors duration-300 uppercase CadillacGothic-Regular ${
                    activePlanTab === tab ? 'text-white' : 'text-black hover:text-[#28659b]'
                  }`}
                >
                  {tab}
                  {activePlanTab === tab && (
                    <motion.div
                      layoutId="planTabPill"
                      className="absolute inset-0 bg-[#28659b] rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="relative min-h-[500px]">
            <AnimatePresence mode="wait">
              {activePlanTab === 'SITEPLAN' ? (
                <motion.div
                  key="siteplan"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5 }}
                  className="w-full rounded-3xl overflow-hidden shadow-2xl bg-white p-4 md:p-8"
                >
                  <img 
                    src={sitplan57} 
                    alt="Project Site Plan" 
                    className="w-full h-auto object-cover rounded-2xl"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="floorplans"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Swiper
                    onSwiper={(s) => (floorSwiper.current = s)}
                    modules={[Navigation, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1.2}
                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                    breakpoints={{
                      768: { slidesPerView: 2 },
                      1024: { slidesPerView: 3 }
                    }}
                    className="!overflow-visible"
                  >
                    {project.floorPlans.map((plan, i) => (
                      <SwiperSlide key={i}>
                        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm group cursor-pointer h-full">
                          <div className="relative aspect-square overflow-hidden rounded-2xl mb-6 bg-[#f8f8f8]">
                            <img 
                              src={plan.image} 
                              className="w-full h-full object-contain p-8 mix-blend-multiply opacity-60 blur-[10px] group-hover:blur-[10px] group-hover:opacity-100 transition-all duration-700 ease-in-out" 
                              alt={plan.title} 
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                                <Maximize2 className="text-black" size={20} />
                              </div>
                            </div>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 px-4 py-1 rounded-full text-[9px] font-bold tracking-tighter uppercase text-black pointer-events-none group-hover:opacity-0 transition-opacity">
                              Hover to Reveal
                            </div>
                          </div>
                          <h5 className="text-center font-bold text-gray-800 uppercase text-[12px] tracking-[0.2em] CadillacGothic-Regular">
                            {plan.title}
                          </h5>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center justify-center mt-16 gap-8">
            <div className="flex items-center justify-center gap-6">
              <button 
                onClick={() => floorSwiper.current?.slidePrev()} 
                className={`p-4 border border-black/50 rounded-full hover:bg-black hover:text-white transition-all shadow-sm ${activePlanTab === 'SITEPLAN' ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
              >
                <ChevronLeft size={20} />
              </button>
              <button className="group relative overflow-hidden px-16 py-5 bg-[#28659b] text-white text-[14px] font-bold uppercase tracking-[0.3em] rounded-full transition-all shadow-xl CadillacGothic-Regular">
                <span className="relative z-10 transition-transform duration-300 group-hover:scale-110 inline-block">Request Brochure</span>
                <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              </button>
              <button 
                onClick={() => floorSwiper.current?.slideNext()} 
                className={`p-4 border border-black/50 rounded-full hover:bg-black hover:text-white transition-all shadow-sm ${activePlanTab === 'SITEPLAN' ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest CadillacGothic-Regular">
               *Detailed architectural drawings available upon request
            </p>
          </div>
        </div>
      </section>


// about us
{/* UPDATED SECTION: RUNNING COUNTERS */}
      <section className="relative py-12 md:py-12 px-6 md:px-22 border-b border-gray-100 overflow-hidden bg-white">
        
        {/* ADJUSTABLE BACKGROUND IMAGE EFFECT */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]" // <--- MANAGE OPACITY HERE
          style={{ 
            backgroundImage: `url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000")`, // <--- MANAGE IMAGE URL HERE
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} 
        />

        <div className="relative z-10 max-w-[1450px] mx-auto">
          {/* Grid restricted to 4 columns on desktop, text aligned left */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 lg:gap-0 text-left">
            <RunningCounter target="5" label="neighbourhood bazaars under construction" />
            <RunningCounter target="3" label="neighbourhood bazaars up and running" />
            <RunningCounter target="1" label="commercial space in operation" />
            <RunningCounter target="1" label="new launch" hasBorder={false} /> 
          </div>
        </div>
      </section>


 {/* mission vision */}
<section className="bg-[#f1f8ff] py-24 px-6 md:px-12 overflow-hidden">
  <div className="max-w-[1450px] mx-auto">
    
    {/* 2. TITLE & SUBTITLE CENTERED */}
    <div className="text-center mb-20">
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.4em] mb-3 CadillacGothic-Regular"
      >
        Guiding Principles
      </motion.p>
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-[48px] tracking-tight font-serif text-black PlayfairDisplay"
      >
        Our Mission & Vision
      </motion.h2>
    </div>

    {/* 3. TWO COLUMNS GRID */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      
      {/* 4. MISSION COLUMN (FLIP ANIMATION) */}
      <motion.div 
        initial={{ rotateY: 90, opacity: 0 }}
        whileInView={{ rotateY: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col md:flex-row bg-[#f8f9fa] overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-500"
      >
        {/* Left Image */}
        <div className="w-full md:w-1/2 h-[300px] md:h-auto overflow-hidden">
          <img 
            src={mision} 
            alt="Mission" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
        {/* Right Content */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white border border-gray-100">
          <Target className="text-gray-400 mb-4" size={32} strokeWidth={1.5} />
           
          <h4 className="text-[38px] font-serif text-black mb-4 PlayfairDisplay">Mission</h4>
          
          {/* 6. ANIMATED DIVIDER */}
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "40px" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-[2px] bg-[#9d2a2a] mb-6"
          />
          
          <p className="text-gray-600 text-sm leading-relaxed CadillacGothic-Regular">
            To redefine urban landscapes by delivering innovative, high-quality, and sustainable commercial 
            and residential spaces that enhance community life.
          </p>
        </div>
      </motion.div>

      {/* 5. VISION COLUMN (FLIP ANIMATION) */}
      <motion.div 
        initial={{ rotateY: -90, opacity: 0 }}
        whileInView={{ rotateY: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="flex flex-col md:flex-row bg-[#f8f9fa] overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-500"
      >
        {/* Left Image */}
        <div className="w-full md:w-1/2 h-[300px] md:h-auto overflow-hidden">
          <img 
            src={vision} 
            alt="Vision" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
        {/* Right Content */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white border border-gray-100">
          <Headphones className="text-gray-400 mb-4" size={32} strokeWidth={1.5} />
           
          <h4 className="text-[38px] font-serif text-black mb-4 PlayfairDisplay">Vision</h4>
          
          {/* 6. ANIMATED DIVIDER */}
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "40px" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-[2px] bg-[#9d2a2a] mb-6"
          />
          
          <p className="text-gray-600 text-sm leading-relaxed CadillacGothic-Regular">
            To be the most trusted and preferred real estate partner, committed to excellence for our 
            customer satisfaction and architectural brilliance.
          </p>
        </div>
      </motion.div>

    </div>
  </div>
</section>