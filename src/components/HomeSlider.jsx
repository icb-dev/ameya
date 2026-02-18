import React, { useState, useEffect, useRef } from "react";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || 'https://seagreen-porcupine-656193.hostingersite.com';

const HomeSlider = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  // Auto slide every 4 sec
  const delay = 4000;

  // Resolve image URL - handles both full URLs and relative paths
  const resolveImage = (path) => {
    if (!path) return null;
    const trimmed = String(path).trim();

    // If already a full URL, use it directly
    if (/^https?:\/\//i.test(trimmed)) {
      return encodeURI(trimmed);
    }

    // Starts with /uploads
    if (trimmed.startsWith('/uploads')) {
      return encodeURI(`${API_BASE}${trimmed}`);
    }

    // Contains /uploads/ in a filesystem-like path
    const idxFs = trimmed.lastIndexOf('/uploads/');
    if (idxFs !== -1) {
      return encodeURI(`${API_BASE}${trimmed.substring(idxFs)}`);
    }

    // Windows-style path
    const idxWin = trimmed.lastIndexOf('\\uploads\\');
    if (idxWin !== -1) {
      return encodeURI(
        `${API_BASE}${trimmed
          .substring(idxWin)
          .replace(/\\\\/g, '/')
          .replace(/\\/g, '/')}`
      );
    }

    // Fallback: treat as filename under uploads
    return encodeURI(`${API_BASE}/uploads/${trimmed.replace(/^uploads[\\/]/, '')}`);
  };

  // Fetch banners from backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/homepage-banners/active`);
        if (!res.ok) {
          throw new Error('Failed to load banners');
        }
        const data = await res.json();
        console.log('Banners API response:', data);
        // Filter active banners and sort by display_order
        const activeBanners = (data.banners || [])
          .filter((banner) => banner.is_active)
          .sort((a, b) => {
            if (a.display_order !== b.display_order) {
              return a.display_order - b.display_order;
            }
            return new Date(a.created_at) - new Date(b.created_at);
          });
        console.log('Active banners after filtering:', activeBanners);
        setBanners(activeBanners);
      } catch (err) {
        console.error('Error fetching banners:', err);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (banners.length === 0) return;
    
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prev) =>
          prev === banners.length - 1 ? 0 : prev + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index, banners.length]);

  const nextSlide = () => {
    if (banners.length === 0) return;
    setIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (banners.length === 0) return;
    setIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleBannerClick = (banner) => {
    if (banner.link) {
      window.open(banner.link, '_blank', 'noopener,noreferrer');
    }
  };

  // Don't render if loading or no banners
  if (loading) {
    return (
      <main>
        <div className="flex justify-center ar-banr-dv">
          <div className="w-[70%]">
            <div className="relative w-full h-fit overflow-hidden flex items-center justify-center py-20">
              <p className="text-gray-600">Loading banners...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (banners.length === 0) {
    return (
      <main>
        <div className="flex justify-center ar-banr-dv">
          <div className="w-[70%]">
            <div className="relative w-full h-fit overflow-hidden flex items-center justify-center py-20">
              <p className="text-gray-600">No banners available</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="flex justify-center ar-banr-dv">
        <div className="w-[70%]">
          {/* Slides Wrapper */}
          <div className="relative w-full h-fit overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(${-index * 100}%)`,
              }}
            >
              {banners.map((banner) => {
                const imageUrl = resolveImage(banner.image);
                return (
                  <div key={banner.id} className="w-full h-fit flex-shrink-0">
                    {banner.link ? (
                      <div
                        onClick={() => handleBannerClick(banner)}
                        className="cursor-pointer"
                      >
                        <img
                          src={imageUrl || ''}
                          alt={`Banner ${banner.id}`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    ) : (
                      <img
                        src={imageUrl || ''}
                        alt={`Banner ${banner.id}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls Below Carousel */}
          <div className="flex justify-between items-center mt-6 px-2">
            {/* Both Arrows on Left Side */}
            <div className="flex gap-2 items-center">
              {/* Left Arrow */}
              <button
                onClick={prevSlide}
                className="w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Previous slide"
              >
                <svg 
                  className="w-8 h-8 text-gray-800 stroke-[1.5]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right Arrow */}
              <button
                onClick={nextSlide}
                className="w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Next slide"
              >
                <svg 
                  className="w-8 h-8 text-gray-800 stroke-[1.5]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Dash Indicators on Right Side */}
            <div className="flex gap-3">
              {banners.map((_, i) => (
                <div
                  key={i}
                  className={`h-[2px] w-8 transition-all duration-300 cursor-pointer ${
                    i === index ? "bg-orange-500" : "bg-gray-400"
                  }`}
                  onClick={() => setIndex(i)}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomeSlider;
