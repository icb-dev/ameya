import React from 'react';
import { Link } from 'react-router-dom';
import KeywordsDisplay from '../components/KeywordsDisplay';
import bgimg from '../assets/images/bgimg.png';

const About = () => {
  // Using the same project image structure from Home
  const heroImageUrl = '/img/about-banner.jpg';

  return (
    <main className="bg-white">
      {/* Hero Banner Section */}
      <section className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImageUrl}
            alt="Ameya One Building"
            className="w-full h-full object-cover brightness-75"
          />
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <section className="py-6 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900 transition-colors">HOME</Link>
            <span>&gt;</span>
            <span className="text-gray-900">ABOUT AMEYA</span>
          </nav>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-12 md:py-16 px-6 md:px-10 relative overflow-hidden">
        {/* Decorative Dots - Right Side */}
        <div className="hidden lg:block absolute right-8 top-1/4 w-32 h-64 opacity-20">
          <svg viewBox="0 0 100 200" className="w-full h-full">
            {Array.from({ length: 10 }).map((_, row) =>
              Array.from({ length: 5 }).map((_, col) => (
                <circle
                  key={`dots-${row}-${col}`}
                  cx={col * 25 + 10}
                  cy={row * 20 + 10}
                  r="2"
                  fill="#999"
                />
              ))
            )}
          </svg>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block">
              <h1 className="text-2xl md:text-3xl font-light tracking-[0.3em] text-gray-800 mb-3">
                ABOUT US
              </h1>
              <div className="w-24 h-[3px] bg-red-700 mx-auto"></div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Left Column - Heading */}
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-gray-900">
                The Most Trusted Group For Neighbourhood
              </h2>
            </div>

            {/* Right Column - Content */}
            <div className="space-y-6">
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                Ameya is a professional real estate group based in Gurugram, focused on the development of retail and commercial projects across the city. Driven towards bringing the highest quality of real estate in major business zones and establishing commercial and retail spaces in lucrative locations, Ameya strives to provide maximum value to its esteemed clients.
              </p>

              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                It ensures timely delivery of all projects, with an execution that reflects uncompromised quality. The group's portfolio includes landmark projects such as The Sapphire Chain of Neighbourhood Bazaars and Ameya One on Golf Course Road, setting new standards in retail and commercial real estate development.
              </p>

              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                With a commitment to excellence and a vision for creating thriving commercial hubs, Ameya Group continues to transform Gurugram's retail landscape, delivering spaces that combine functionality with aesthetic appeal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proven Track Record Section */}
      <section className="py-20 md:py-28 lg:py-32 px-6 md:px-10 relative overflow-hidden" style={{ backgroundColor: '#2563B0' }}>
        {/* Decorative Dots Pattern - Right Side */}
        <div className="hidden lg:block absolute right-12 top-1/4 w-40 h-80 opacity-15">
          <svg viewBox="0 0 100 200" className="w-full h-full">
            {Array.from({ length: 15 }).map((_, row) =>
              Array.from({ length: 6 }).map((_, col) => (
                <circle
                  key={`track-dots-${row}-${col}`}
                  cx={col * 18 + 8}
                  cy={row * 13 + 8}
                  r="1.8"
                  fill="white"
                />
              ))
            )}
          </svg>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Section Title */}
          <div className="text-center mb-1 md:mb-2 lg:mb-2">
            <h2 className="text-3xl md:text-4xl font-serif text-white tracking-wide">
              Proven track record
            </h2>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-8 xl:gap-12 max-w-7xl mx-auto">
            {/* Stat 1 */}
            <div className="flex items-center gap-4 md:gap-5 text-white">
              <div className="text-[100px] md:text-[120px] lg:text-[140px] xl:text-[160px] leading-none font-bold flex-shrink-0">
                5
              </div>
              <div className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] leading-[1.7] font-normal text-left">
                NEIGHBOURHOOD<br />
                BAZAARS UNDER<br />
                CONSTRUCTION
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-4 md:gap-5 text-white">
              <div className="text-[100px] md:text-[120px] lg:text-[140px] xl:text-[160px] leading-none font-bold flex-shrink-0">
                3
              </div>
              <div className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] leading-[1.7] font-normal text-left">
                NEIGHBOURHOOD<br />
                BAZAARS UP AND<br />
                RUNNING
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-4 md:gap-5 text-white">
              <div className="text-[100px] md:text-[120px] lg:text-[140px] xl:text-[160px] leading-none font-bold flex-shrink-0">
                1
              </div>
              <div className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] leading-[1.7] font-normal text-left">
                COMMERCIAL<br />
                SPACE IN<br />
                OPERATION
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-4 md:gap-5 text-white">
              <div className="text-[100px] md:text-[120px] lg:text-[140px] xl:text-[160px] leading-none font-bold flex-shrink-0">
                1
              </div>
              <div className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] leading-[1.7] font-normal text-left">
                NEW LAUNCH
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leading Brands Section */}
      <section className="py-16 md:py-20 lg:py-24 px-6 md:px-10 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 leading-tight">
              Leading Brands on Board at the Sapphire Chain of Bazaars
            </h2>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-6 md:gap-8 lg:gap-10 items-center justify-items-center">
            {/* Row 1 */}
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/908078696Titan Eyeplis.jpg" alt="Titan Eyeplus" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/raymond.jpg" alt="The Raymond Shop" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/cross.jpg" alt="Crocs" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/apollo.jpg" alt="Apollo Pharmacy" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/lenskart.jpg" alt="Lenskart" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/holiday.jpg" alt="Holiday Inn" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/bodycar.jpg" alt="Bodycare" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/geetanjli.jpg" alt="Geetanjali" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/pantaloom.jpg" alt="Pantaloons" className="max-h-full max-w-full object-contain" />
            </div>

            {/* Row 2 */}
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/clove.jpg" alt="Clove Dental" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/archies.jpg" alt="Archies" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/hdfc.jpg" alt="HDFC Bank" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/inox.jpg" alt="INOX" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/harish.jpg" alt="Ferns N Petals" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/dominos.jpg" alt="Domino's Pizza" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/subway.jpg" alt="Subway" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/dana.jpg" alt="Dana Choga" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/aiani.jpg" alt="Giani" className="max-h-full max-w-full object-contain" />
            </div>

            {/* Row 3 */}
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/axisbank.jpg" alt="Axis Bank" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/kotak.jpg" alt="Kotak Mahindra Bank" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/induslnd.jpg" alt="IndusInd Bank" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/yochina.jpg" alt="Yo! China" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/wataburget.jpg" alt="Wat-A-Burger" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/giswan.jpg" alt="Dimsum Shakti" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/g.jpg" alt="Cafe Coffee Day" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/tataimg.jpg" alt="Tata 1mg" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-16 md:h-20">
              <img src="/img/bata.jpg" alt="Bata" className="max-h-full max-w-full object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Ethos Section */}
      <section className="py-16 md:py-20 lg:py-24 px-6 md:px-10 bg-white relative overflow-hidden">
        {/* Decorative Circle Dots - Left Side */}
        <div className="hidden lg:block absolute left-8 top-1/3 w-48 h-48 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {Array.from({ length: 20 }).map((_, row) =>
              Array.from({ length: 10 }).map((_, col) => {
                const x = col * 20 + 10;
                const y = row * 10 + 10;
                const centerX = 100;
                const centerY = 100;
                const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                if (distance < 95) {
                  return (
                    <circle
                      key={`ethos-dots-${row}-${col}`}
                      cx={x}
                      cy={y}
                      r="2"
                      fill="#999"
                    />
                  );
                }
                return null;
              })
            )}
          </svg>
        </div>

        {/* Decorative Zigzag - Right Side */}
        <div className="hidden lg:block absolute right-8 bottom-20 w-32 h-16 opacity-20">
          <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
            <polyline
              points="0,50 10,40 20,50 30,40 40,50 50,40 60,50 70,40 80,50 90,40 100,50"
              fill="none"
              stroke="#999"
              strokeWidth="2"
            />
            <polyline
              points="0,35 10,25 20,35 30,25 40,35 50,25 60,35 70,25 80,35 90,25 100,35"
              fill="none"
              stroke="#999"
              strokeWidth="2"
            />
            <polyline
              points="0,20 10,10 20,20 30,10 40,20 50,10 60,20 70,10 80,20 90,10 100,20"
              fill="none"
              stroke="#999"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Title */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block">
              <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] text-gray-600 mb-2">
                OUR ETHOS
              </h2>
              <div className="w-16 h-[2px] bg-red-700 mx-auto"></div>
            </div>
          </div>

          {/* Vision and Mission Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Vision */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-blue-800 mb-6">
                VISION
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                Our vision is to be a growth-first developer that takes pride in the proven track record of prioritizing the highest quality of design, construction and service for our customers. We are passionate about an elevated standard of living for customers through quality standards and the long-term sustainability of our projects. Thorough planning and timely execution are central to our progress as we resolve to work for the total community's good.
              </p>
            </div>

            {/* Mission */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-blue-800 mb-6">
                MISSION
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                We strive to combine innovation with sustainability and deliver work that speaks for itself for years to come and instils confidence in all our partners. Our mission is to make a difference for the better and make quality construction a staple for the Ameya group.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 lg:py-24 px-6 md:px-10 bg-white relative overflow-hidden">
        {/* Decorative Zigzag - Left Side */}
        <div className="hidden lg:block absolute left-8 top-1/2 transform -translate-y-1/2 w-16 h-32 opacity-20">
          <svg viewBox="0 0 50 100" className="w-full h-full" preserveAspectRatio="none">
            <polyline points="0,0 10,10 0,20 10,30 0,40 10,50 0,60 10,70 0,80 10,90 0,100" fill="none" stroke="#999" strokeWidth="2" />
            <polyline points="15,0 25,10 15,20 25,30 15,40 25,50 15,60 25,70 15,80 25,90 15,100" fill="none" stroke="#999" strokeWidth="2" />
            <polyline points="30,0 40,10 30,20 40,30 30,40 40,50 30,60 40,70 30,80 40,90 30,100" fill="none" stroke="#999" strokeWidth="2" />
          </svg>
        </div>

        {/* Decorative Dots - Right Side */}
        <div className="hidden lg:block absolute right-12 bottom-20 w-40 h-40 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 8 }).map((_, col) => (
                <circle
                  key={`values-dots-${row}-${col}`}
                  cx={col * 14 + 7}
                  cy={row * 14 + 7}
                  r="2"
                  fill="#999"
                />
              ))
            )}
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Title */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-700">
              VALUES
            </h2>
          </div>

          {/* Values Content Box */}
          <div className="bg-black relative overflow-hidden rounded-lg shadow-2xl">
            {/* Background Image Overlay */}
            <div className="absolute inset-0">
              <img 
                src="/img/men.jpg" 
                alt="Professional background" 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-black opacity-30"></div>
            </div>

            {/* Values Grid */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-8 md:p-12 lg:p-16">
              {/* Good Judgement */}
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-blue-500 uppercase tracking-wide">
                  GOOD JUDGEMENT
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-white">
                  No business is without risk but we believe our thorough research and exceptional analysis of current and projected market trends sets us apart. We constantly strive to create experiences by applying our expertise in retail to our neighbourhood bazaars.
                </p>
              </div>

              {/* Integrity and Commitment */}
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-blue-500 uppercase tracking-wide">
                  INTEGRITY AND COMMITMENT
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-white">
                  We believe in keeping our word and delivering exactly what we promised. We make sure to have a client-centric attitude by avoiding dealings that might lead to conflicts of interest.
                </p>
              </div>

              {/* Quality */}
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-blue-500 uppercase tracking-wide">
                  QUALITY
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-white">
                  We never take quality for granted since it is what brings shoppers back. We value and reward high-quality work by expecting high standards and seeking our customers' trust in return.
                </p>
              </div>

              {/* Sustainability */}
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-blue-500 uppercase tracking-wide">
                  SUSTAINABILITY
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-white">
                  We are in the business for the long term. Hence, we always plan, design, and implement our projects with a view towards ensuring. Our building designs emphasize on the minimization of electricity usage, water-sensitive designs for landscaping and the incorporation of necessary measures to ensure the benefit of both the building as well as the surrounding environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16 md:py-20 lg:py-24 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block">
              <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] text-gray-600 mb-2">
                LEADERSHIP
              </h2>
              <div className="w-16 h-[2px] bg-red-700 mx-auto"></div>
            </div>
          </div>

          {/* Leadership Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
            {/* Sanjay Gupta */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                SANJAY GUPTA
              </h3>
              <p className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                JOINT MANAGING DIRECTOR
              </p>
              <p className="text-sm leading-relaxed text-gray-800">
                A veteran of the real-estate industry, Sanjay Gupta performs the crucial role of leading decision-making and operations at Ameya. His foresight and vision have contributed immensely towards the establishment of major benchmarks for Ameya. An inspiration to all around him, he is leading the company into a new era, contributing significantly towards bettering systems, streamlining processes and maximizing efficiency of product delivery, with a focus on fulfilling the needs of the modern Indian consumer.
              </p>
            </div>

            {/* Deepak Gupta */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                DEEPAK GUPTA
              </h3>
              <p className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                CHAIRMAN & MANAGING DIRECTOR
              </p>
              <p className="text-sm leading-relaxed text-gray-800">
                He has been in the business of real estate for the last 20 years. He has played a critical role in finalizing commercial aspects of the real-estate business for some of the top real estate companies in India. He founded Ameya in the year 2008 with the focus on making move one of India's best commercial real estate organizations. He is a firm believer in the fact that integrity and quality should never be compromised.
              </p>
            </div>

            {/* Akshat Gupta */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                AKSHAT GUPTA
              </h3>
              <p className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                DIRECTOR
              </p>
              <p className="text-sm leading-relaxed text-gray-800">
                The new generation entrepreneur of the family, Akshat Gupta is resides aboard the group's management. With a degree in business management from the United Kingdom and a Masters in Civil and Architectural Engineering (MIT), he possesses a strong foundation suited to the group's growing real estate business. He strives to keep the organisation focused towards its goals and objectives, while also being actively involved in nurturing new projects from the inception stage itself, with a vision to raise the bar with Ameya in times to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ameya's Approach to Community Shopping Section */}
      <section className="py-16 md:py-20 lg:py-24 px-6 md:px-10 bg-white relative overflow-hidden">
        {/* Decorative Circle Dots - Left Side */}
        <div className="hidden lg:block absolute left-8 top-1/4 w-48 h-48 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {Array.from({ length: 20 }).map((_, row) =>
              Array.from({ length: 10 }).map((_, col) => {
                const x = col * 20 + 10;
                const y = row * 10 + 10;
                const centerX = 100;
                const centerY = 100;
                const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                if (distance < 95) {
                  return (
                    <circle
                      key={`approach-dots-${row}-${col}`}
                      cx={x}
                      cy={y}
                      r="2"
                      fill="#999"
                    />
                  );
                }
                return null;
              })
            )}
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Title */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight">
              Ameya's Approach to<br />Community Shopping
            </h2>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Building Image */}
            <div className="order-2 lg:order-1">
              <img 
                src="/img/aboutlast.jpg" 
                alt="Community Shopping Building" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>

            {/* Right - Features List */}
            <div className="order-1 lg:order-2 space-y-8">
              {/* Excellent Location */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-blue-700 uppercase tracking-wide mb-3">
                  EXCELLENT LOCATION
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-800">
                  Located in the heart of bustling residential areas, our neighbourhood bazaars cater to the daily essential needs of all residents around them.
                </p>
              </div>

              {/* Convenient Access */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-blue-700 uppercase tracking-wide mb-3">
                  CONVENIENT ACCESS
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-800">
                  The bazaars provide convenient access, making it easier for all kinds of customers to have a smooth and satisfying shopping experience.
                </p>
              </div>

              {/* Zoning for Optimal Experience */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-blue-700 uppercase tracking-wide mb-3">
                  ZONING FOR OPTIMAL EXPERIENCE
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-800">
                  The popularity of the neighbourhood bazaars makes them a landmark for directions for the surrounding areas.
                </p>
              </div>

              {/* Designed for Repeated Footfalls */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-blue-700 uppercase tracking-wide mb-3">
                  DESIGNED FOR REPEATED FOOTFALLS
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-800">
                  The varied food options attract food enthusiasts from places that are farther away, due to the success of the food haat.
                </p>
              </div>

              {/* Low CAM Charges */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-blue-700 uppercase tracking-wide mb-3">
                  LOW CAM CHARGES
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-gray-800">
                  More savings with low common area maintenance charges compared to shopping malls.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Keywords Display */}
      <KeywordsDisplay />
    </main>
  );
};

export default About;

