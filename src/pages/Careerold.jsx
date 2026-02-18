import React from 'react';
import { Link } from 'react-router-dom';
import KeywordsDisplay from '../components/KeywordsDisplay';

const Career = () => {
  // Using a professional banner image - you can replace this with your actual career banner
  const careerBannerUrl = '/img/carreer.jpg';

  return (
    <main className="bg-white">
      {/* Hero Banner Section */}
      <section className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={careerBannerUrl}
            alt="Ameya Career"
            className="w-full h-full object-cover brightness-75"
          />
          {/* Overlay for better text contrast if needed */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-blue-900/40"></div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <section className="py-6 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900 transition-colors">HOME</Link>
            <span>&gt;</span>
            <span className="text-gray-900">CAREER</span>
          </nav>
        </div>
      </section>

      {/* Career Content Section */}
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
                      key={`career-dots-${row}-${col}`}
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

        {/* Decorative Wavy Line - Bottom Right */}
        <div className="hidden lg:block absolute right-8 bottom-20 w-32 h-16 opacity-20">
          <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
            <polyline
              points="0,50 10,40 20,50 30,40 40,50 50,40 60,50 70,40 80,50 90,40 100,50"
              fill="none"
              stroke="#999"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Title */}
          <div className="mb-12 md:mb-16">
            <div className="inline-block">
              <h1 className="text-xs md:text-sm uppercase tracking-[0.3em] text-gray-600 mb-2">
                CAREER
              </h1>
              <div className="w-16 h-[2px] bg-red-700 mx-auto"></div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto">
            <p className="text-sm md:text-base leading-relaxed text-gray-800 mb-6">
              Ameya is a dynamic workplace that values teamwork, innovative thinking, and curiosity. We seek individuals passionate about building quality architecture for both financial and social purposes.
            </p>
            <p className="text-sm md:text-base leading-relaxed text-gray-800 mb-6">
              Join the Ameya group to build spaces that celebrate community living.
            </p>
            <p className="text-sm md:text-base leading-relaxed text-gray-800">
              Please send your updated resume at{' '}
              <a 
                href="mailto:hr@ameyagroup.in" 
                className="text-blue-600 hover:text-blue-800 underline transition-colors"
              >
                hr@ameyagroup.in
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Keywords Display */}
      <KeywordsDisplay />
    </main>
  );
};

export default Career;

