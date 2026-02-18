import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import KeywordsDisplay from '../../components/KeywordsDisplay';
// import '/styles/resi.css';
import '../../styles/resi.css';

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || 'https://seagreen-porcupine-656193.hostingersite.com';

export default function SapphireResidences() {
  const { title } = useParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [isMenuOpening, setIsMenuOpening] = useState(false);

  // Backend residence data
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Default features used if backend does not provide any (address snapshot)
  const defaultFeatures = [
    "TWO TOWERS G+18\nFLOORS SPREAD OVER\n2.5 ACRE",
    "SELECT 116 RESIDENCES",
    "GATED COMPLEX WITH\nMODERN AMENITIES",
    "24X7 MULTI-TIER\nSECURITY",
    "3-LEVEL G+2 PARKING",
    "DOUBLE HEIGHT\nARRIVAL LOBBY",
    "LUXURY 3.5 BHK\nAPARTMENTS",
    "DEDICATED COMMON\nROOM FOR DOMESTIC\nHELPS",
    "PREMIER CLUBHOUSE\nOF OVER 25,000 SQ.FT.",
    "STATE-OF-THE-ART GYMNASIUM",
    "INFINITY EDGE SWIMMING POOL"
  ];

  // Helper to create slug from title (must match Projects.jsx)
  const createSlug = (str) => {
    if (!str) return '';
    return encodeURIComponent(String(str).trim().toLowerCase().replace(/\s+/g, '-'));
  };

  // Fetch residence property data from backend
  useEffect(() => {
    const fetchResidence = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(`${API_BASE}/api/admin/residence-properties`);
        if (!res.ok) {
          throw new Error('Failed to load residence details.');
        }

        const data = await res.json();

        // Normalise to an array of properties
        let list = [];
        if (Array.isArray(data?.properties)) {
          list = data.properties;
        } else if (Array.isArray(data)) {
          list = data;
        } else if (Array.isArray(data?.items)) {
          list = data.items;
        } else if (data && typeof data === 'object') {
          list = [data];
        }

        if (!list.length) {
          setProperty(null);
          return;
        }

        // If URL has :title param, try to match by slug of banner_title
        let found = null;
        if (title) {
          found =
            list.find(
              (item) =>
                createSlug(item.banner_title) === title ||
                createSlug(item.address_title) === title
            ) || null;
        }

        setProperty(found || list[0]);
      } catch (err) {
        console.error('Error fetching residence details:', err);
        setError('Unable to load residence details from the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchResidence();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when menu is open and handle escape key
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          handleCloseMenu();
        }
      };
      window.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  // Handle global mouse events for map dragging
  useEffect(() => {
    if (isDragging && mapZoom > 1) {
      const handleGlobalMouseMove = (e) => {
        setMapPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };

      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragStart, mapZoom]);

  // Handle menu open with animation
  const handleOpenMenu = () => {
    setIsMenuOpening(true);
    setIsMenuOpen(true);
    // Trigger opening animation after DOM update
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsMenuOpening(false);
      });
    });
  };

  // Handle menu close with animation
  const handleCloseMenu = () => {
    setIsMenuClosing(true);
    setIsMenuOpening(false); // Reset opening state
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsMenuClosing(false);
    }, 300); // Match the animation duration
  };

  // Map zoom handlers
  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 0.2, 3)); // Max zoom 3x
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 0.2, 0.5)); // Min zoom 0.5x
  };

  const handleResetZoom = () => {
    setMapZoom(1);
    setMapPosition({ x: 0, y: 0 });
  };

  // Map drag handlers
  const handleMouseDown = (e) => {
    if (mapZoom > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - mapPosition.x, y: e.clientY - mapPosition.y });
    }
  };

  const handleTouchStart = (e) => {
    if (mapZoom > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ 
        x: e.touches[0].clientX - mapPosition.x, 
        y: e.touches[0].clientY - mapPosition.y 
      });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && mapZoom > 1 && e.touches.length === 1) {
      e.preventDefault();
      setMapPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  // Address features (first snapshot section)
  const addressFeaturesList = (() => {
    try {
      let fromBackend = property?.address_features;
      if (!fromBackend) return defaultFeatures;

      // In case backend ever sends JSON string
      if (typeof fromBackend === 'string') {
        const parsed = JSON.parse(fromBackend);
        if (Array.isArray(parsed)) fromBackend = parsed;
      }

      if (Array.isArray(fromBackend) && fromBackend.length > 0) {
        return fromBackend
          .map((item) => (typeof item === 'string' ? item : item?.text || ''))
          .filter(Boolean);
      }
    } catch (e) {
      console.warn('Failed to parse address_features from backend', e);
    }
    return defaultFeatures;
  })();

  // Residences features (second snapshot section)
  const residencesFeaturesList = (() => {
    try {
      let fromBackend = property?.residences_features;
      if (!fromBackend) return addressFeaturesList;

      if (typeof fromBackend === 'string') {
        const parsed = JSON.parse(fromBackend);
        if (Array.isArray(parsed)) fromBackend = parsed;
      }

      if (Array.isArray(fromBackend) && fromBackend.length > 0) {
        return fromBackend
          .map((item) => (typeof item === 'string' ? item : item?.text || ''))
          .filter(Boolean);
      }
    } catch (e) {
      console.warn('Failed to parse residences_features from backend', e);
    }
    return addressFeaturesList;
  })();

  // Club features for club section
  const defaultClubFeatures = [
    'EXCLUSIVE CLUBHOUSE',
    'STATE-OF-THE-ART GYMNASIUM',
    'INDOOR GAMES ROOM',
    "CHILDREN'S PLAY ZONE",
    "RESIDENTS' LOUNGE",
  ];

  const clubFeaturesList = (() => {
    try {
      let fromBackend = property?.club_features;
      if (!fromBackend) return defaultClubFeatures;

      if (typeof fromBackend === 'string') {
        const parsed = JSON.parse(fromBackend);
        if (Array.isArray(parsed)) fromBackend = parsed;
      }

      if (Array.isArray(fromBackend) && fromBackend.length > 0) {
        return fromBackend
          .map((item) => (typeof item === 'string' ? item : item?.text || ''))
          .filter(Boolean);
      }
    } catch (e) {
      console.warn('Failed to parse club_features from backend', e);
    }
    return defaultClubFeatures;
  })();

  // Plans (site / floor plans) for gallery section
  const plansList = (() => {
    try {
      let fromBackend = property?.plans;
      if (!fromBackend) return [];

      // In case backend ever sends JSON string
      if (typeof fromBackend === 'string') {
        const parsed = JSON.parse(fromBackend);
        if (Array.isArray(parsed)) fromBackend = parsed;
      }

      if (Array.isArray(fromBackend) && fromBackend.length > 0) {
        return fromBackend
          .map((item) => {
            if (!item) return null;
            if (typeof item === 'string') {
              // If only image URL is provided
              return { name: '', img: item };
            }
            if (typeof item === 'object') {
              return {
                name: item.name || '',
                img: item.img || item.url || '',
              };
            }
            return null;
          })
          .filter((item) => item && item.img);
      }
    } catch (e) {
      console.warn('Failed to parse plans from backend', e);
    }
    return [];
  })();

  // Nearby section data (time, locations, text)
  const nearbyTimeList = (() => {
    try {
      let v = property?.nearby_time;
      if (!v) return [];

      if (typeof v === 'string') {
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) v = parsed;
      }

      if (Array.isArray(v)) {
        return v
          .map((item) => (typeof item === 'string' ? item : item?.text || ''))
          .filter(Boolean);
      }
    } catch (e) {
      console.warn('Failed to parse nearby_time from backend', e);
    }
    return [];
  })();

  const nearbyLocationList = (() => {
    try {
      let v = property?.nearby_location;
      if (!v) return [];

      if (typeof v === 'string') {
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) v = parsed;
      }

      if (Array.isArray(v)) {
        return v
          .map((item) => (typeof item === 'string' ? item : item?.text || ''))
          .filter(Boolean);
      }
    } catch (e) {
      console.warn('Failed to parse nearby_location from backend', e);
    }
    return [];
  })();

  const nearbyTextList = (() => {
    try {
      let v = property?.nearby;
      if (!v) return [];

      if (typeof v === 'string') {
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) v = parsed;
      }

      if (Array.isArray(v)) {
        return v
          .map((item) => (typeof item === 'string' ? item : item?.text || ''))
          .filter(Boolean);
      }
    } catch (e) {
      console.warn('Failed to parse nearby from backend', e);
    }
    return [];
  })();

  return (
    <>
      {/* Full Page Navigation Menu */}
      {(isMenuOpen || isMenuClosing || isMenuOpening) && (
        <div 
          className={`fixed inset-0 bg-[#2a2a2a] z-[9999] flex items-center justify-center transition-all duration-300 ${
            isMenuClosing || isMenuOpening ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {/* Close Button */}
          <button
            onClick={handleCloseMenu}
            className="absolute top-8 right-8 text-gray-300 hover:text-white transition-colors duration-300 text-3xl font-light"
            aria-label="Close menu"
          >
            ×
          </button>

          {/* Navigation Content */}
          <div className={`text-center transition-opacity duration-300 ${
            isMenuClosing || isMenuOpening ? 'opacity-0' : 'opacity-100'
          }`}>
            {/* First Row */}
            <div className="mb-8">
              <a 
                href="#snapshot" 
                onClick={(e) => {
                  e.preventDefault();
                  handleCloseMenu();
                  setTimeout(() => {
                    document.getElementById('snapshot')?.scrollIntoView({ behavior: 'smooth' });
                  }, 350);
                }}
                className="text-gray-300 hover:text-white transition-colors duration-300 text-2xl lg:text-3xl font-light tracking-wide"
              >
                SNAPSHOT
              </a>
              <span className="text-gray-500 mx-6 text-xl lg:text-2xl">|</span>
              <a 
                href="#club" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('club')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-gray-300 hover:text-white transition-colors duration-300 text-2xl lg:text-3xl font-light tracking-wide"
              >
                CLUB
              </a>
              <span className="text-gray-500 mx-6 text-xl lg:text-2xl">|</span>
              <a 
                href="#green-hub" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('green-hub')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-gray-300 hover:text-white transition-colors duration-300 text-2xl lg:text-3xl font-light tracking-wide"
              >
                GREEN HUB
              </a>
            </div>

            {/* Second Row */}
            <div className="mb-8">
              <a 
                href="#residences" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('residences')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-gray-300 hover:text-white transition-colors duration-300 text-2xl lg:text-3xl font-light tracking-wide"
              >
                RESIDENCES
              </a>
              <span className="text-gray-500 mx-6 text-xl lg:text-2xl">|</span>
              <a 
                href="#gallery" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-gray-300 hover:text-white transition-colors duration-300 text-2xl lg:text-3xl font-light tracking-wide"
              >
                GALLERY
              </a>
              <span className="text-gray-500 mx-6 text-xl lg:text-2xl">|</span>
              <a 
                href="#location" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-gray-300 hover:text-white transition-colors duration-300 text-2xl lg:text-3xl font-light tracking-wide"
              >
                LOCATION
              </a>
            </div>

            {/* Third Row */}
            <div>
              <a 
                href="#contact" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-gray-300 hover:text-white transition-colors duration-300 text-2xl lg:text-3xl font-light tracking-wide"
              >
                CONTACT
              </a>
            </div>
          </div>
        </div>
      )}

      <div className='wrap-border'> </div>
      <div className={`nav-border transition-opacity duration-10 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}> </div>
      <div className='border-line sticky top-0'> </div>

      {/* Background with parallax and zoom effect */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-zoom-animation -z-10"
        style={{
          backgroundImage: property?.banner_background
            ? `url(${property.banner_background})`
            : 'url("https://www.ameyagroup.in/sapphire-residences/static/media/banner.c20bdaa38641aede7926.webp")',
          transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0001})`,
        }}
      />

      <div className="relative w-full min-h-screen overflow-y-auto z-10">

        {/* Header */}
        <header className={`fixed top-0 left-0 right-0 z-[1001] flex items-center justify-between px-16 py-6 transition-all duration-300 ${isScrolled ? 'bg-[#292929] backdrop-blur-sm' : ''}`}>
          {/* Logo */}

          <div className="flex flex-col items-start ">
            <div className='flex items-center'>

              <img className='w-[100%]  lg:w-[15%] md:w-[15%] ml-[-30px] lg:ml-[80px]' src="https://www.ameyagroup.in/sapphire-residences/static/media/logo.20da3f14d1fba6180ea0.png"></img>

            </div>
          </div>

          {/* CTA Button */}
          <button className="border rounded-full border-white/50 text-white px-8 py-2.5 tracking-[0.2em] text-xs hover:bg-white/10 transition-all duration-300 font-light">
            ENQUIRE NOW
          </button>

          <button 
            onClick={handleOpenMenu}
            className="rounded-full text-white px-8 py-2.5 tracking-[0.2em] text-xs hover:bg-white/10 transition-all duration-300 font-light"
            aria-label="Open menu"
          >
            <span className="block w-6 h-0.5 bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </button>
        </header>

        {/* Main Content - Building Image and Text */}
        <div className="relative z-10 flex items-center justify-center h-[calc(100vh-120px)]">
          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-white text-[2.5rem] leading-tight font-extralight tracking-[0.15em] mb-2">
              LIVE CLOSE

            </h1>
            <h2 className="text-white text-[2.5rem] leading-tight font-extralight tracking-[0.15em] mb-12">
              TO THE CITY PULSE
            </h2>

            {/* Subheading */}
            <p className="text-white/90 text-lg mt-[-30px] font-light">
              {property?.banner_location || 'At The Greenest Sector of Gurugram'}
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <div className="absolute bottom-8 right-16 z-10">
          <div className="text-right">
            <p className="text-white text-[10px] tracking-[0.3em] font-light">
              SAPPHIRES RESIDENCES
            </p>
            <p className="text-white text-[10px] tracking-[0.3em] font-light mt-0.5">
              SECTOR 15 (PART-II), GURUGRAM
            </p>
          </div>
        </div>

        {/* Snapshot Section */}
        <section className="relative bg-white py-20 px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            {/* Section Heading */}
            <div className="text-center mb-8">
              <p className="text-sm tracking-[0.3em] text-gray-600 mb-4">SNAPSHOT</p>
              <h2 className="text-3xl lg:text-4xl font-light tracking-wide text-[#B39248]">
                {property?.address_title || 'AN ADDRESS FOR THE SELECT FEW'}
              </h2>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 mt-16">
              {/* Left - Image */}
              <div className="w-full">
                <img 
                  src={
                    property?.address_img
                      ? property.address_img
                      : "https://www.ameyagroup.in/sapphire-residences/static/media/Snapshot.b7a838f92b1b031f1fc8.webp"
                  }
                  alt="Project snapshot"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right - Feature Grid (Dynamic - 3 per row) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-px bg-[#B39248] border border-[#B39248]">
                {addressFeaturesList.map((feature, index) => {
                  // Last 2 items span 3 columns each (half width), others span 2 columns
                  const isLastRow = index >= addressFeaturesList.length - 2;
                  const colSpan = isLastRow ? 'lg:col-span-3' : 'lg:col-span-2';
                  
                  return (
                    <div 
                      key={index} 
                      className={`bg-white p-6 flex items-center justify-center text-center min-h-[150px] ${colSpan} md:col-span-1`}
                    >
                      <p className="text-xs lg:text-sm tracking-wide leading-relaxed whitespace-pre-line uppercase">
                        {feature}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Amenities Access Section */}
        <section className="relative bg-white py-20 px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
              {/* Centered Text Content */}
              <div className="lg:col-span-2 flex justify-center items-center">
                <div className="w-full text-center flex flex-col items-center">
                  <div className="border-t-1 border-[#B39248] w-[95%] mb-8"></div>
                  <h2 className="text-3xl text-start lg:text-3xl xl:text-3xl font-light leading-tight text-[#B39248] tracking-wide whitespace-pre-line uppercase">
                    {property?.basic_amenities_text || `ENJOY
EFFORTLESS ACCESS
TO LUXURIOUS
AMENITIES`}
                  </h2>
                  <div className="border-b-1 border-[#B39248] w-[95%] mt-8"></div>
                </div>
              </div>

              {/* Right - Amenities Image */}
              <div className="lg:col-span-3">
                <img 
                  src={
                    property?.basic_amenities_img
                      ? property.basic_amenities_img
                      : "https://www.ameyagroup.in/sapphire-residences/static/media/Amanities.f83a12f8c093e98220c6.webp"
                  }
                  alt="Luxurious Amenities"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CLUB Section */}
        <section className="relative bg-white py-20 px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.4em] text-gray-500 mb-6">CLUB</p>
              <h2 className="text-3xl lg:text-4xl font-light tracking-wide text-[#B39248] mb-8">
                {property?.club_title || 'EMBRACE A REWARDING CLUB LIFE'}
              </h2>
              <p className="text-gray-700 text-base lg:text-lg max-w-4xl mx-auto leading-relaxed font-light">
                {property?.club_description ||
                  "Immerse yourself in the lap of luxury at Club Sapphire, spread over level 3 of both the towers. Whether you're relaxing in the stylish residents' lounge, taking a dip in the gorgeous swimming pool, or working out in the well-appointed fitness center, you'll find plenty to enjoy a rich and rewarding lifestyle."}
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-0 mt-16 border border-[#B39248]">
              {/* Left - Dynamic Club Features Grid */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#B39248]">
                  {clubFeaturesList.map((feature, index) => (
                    <div
                      key={index}
                      className={`bg-white p-12 flex items-center justify-center min-h-[180px] ${
                        // mimic some spanning on larger screens to keep visual interest
                        index === 2 ? 'md:col-span-2 lg:col-span-1' : ''
                      }`}
                    >
                      <p className="text-sm lg:text-base tracking-wide uppercase text-center font-light">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Pool Image */}
              <div className="lg:col-span-1">
                <img 
                  src={
                    property?.club_img
                      ? property.club_img
                      : "https://www.ameyagroup.in/sapphire-residences/static/media/club.f693b076ec5913199d0d.webp"
                  }
                  alt="Club Sapphire Pool"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

 




        <section className='bg-white'>

<div
  style={{
    backgroundImage: property?.cafe_img
      ? `url(${property.cafe_img})`
      : 'url("https://www.ameyagroup.in/sapphire-residences/static/media/green-hub.eb09f70bac027ecb85be.webp")',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    width: '80%',
    margin:'auto',
    height: '600px'
  }}
>

<div className="flex items-center justify-center h-full w-full">
  <div className="text-2xl text-center text-white">
    <h2 className="text-center">
      {property?.cafe_titles || 'CAFE'}
    </h2>
    <div className="mt-4">
      {property?.cafe_title ||
        'CENTRAL GREEN LANDSCAPING | SENIOR CITIZENS PARK KIDS’ PLAY AREA WITH EQUIPMENT | DEDICATED PET AREA'}
    </div>
  </div>
</div>


</div>
 
</section>










        {/* Wellness & Games Lounge Section */}
        <section className="relative bg-white py-24 px-8 lg:px-16">
          <div className="max-w-7xl mx-auto space-y-20">
            {/* Wellness Gym Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left - Text */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-b mx-auto border-[#B39248] pt-10 pb-10 text-start">
                  <h3 className="text-xl lg:text-2xl tracking-wide text-[#B39248] leading-relaxed font-light">
                    {property?.feature_text1}
                  </h3>
                </div>
                {/* Decorative Gold Block */}
                <div className="absolute -bottom-4 right-0 w-16 h-6 bg-[#B39248]" />
              </div>

              {/* Right - Gym Image */}
              <div className="w-full h-full">
                <img
                  src={
                    property?.feature_img1
                      ? property.feature_img1
                      : "https://www.ameyagroup.in/sapphire-residences/static/media/amenities01.d4024211abf007c7871b.webp"
                  }
                  alt="Well-equipped gym"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Games Lounge Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-[-190px] ml-[180px]">
              {/* Left - Games Lounge Image */}
              <div className="w-full h-full">
                <img
                  src={
                    property?.feature_img2
                      ? property.feature_img2
                      : "https://www.ameyagroup.in/sapphire-residences/static/media/amenities01.d4024211abf007c7871b.webp"
                  }
                  alt="Games lounge with pool table"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right - Text */}
              <div className="relative">
                <div className="border-t border-b border-[#B39248] pt-[-20px] pb-10">
                  <h3 className="text-xl lg:text-2xl tracking-wide text-[#B39248] leading-relaxed font-light">
                    {property?.feature_text2}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>


<section className='bg-white'>

<div
  style={{
    backgroundImage: property?.greenhub_bg_img
      ? `url(${property.greenhub_bg_img})`
      : 'url("https://www.ameyagroup.in/sapphire-residences/static/media/green-hub.eb09f70bac027ecb85be.webp")',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    width: '80%',
    margin:'auto',
    height: '600px'
  }}
>

<div className='mx-auto text-center text-white relative'>
<div className='text-2xl absolute top-[30vh] lg:top-[50vh] left-0'>
<h2 className=''>
  {property?.greenhub_title || 'ENGAGING GREEN HUB'}
</h2>
{property?.greenhub_description ||
  'CENTRAL GREEN LANDSCAPING | SENIOR CITIZENS PARK KIDS’ PLAY AREA WITH EQUIPMENT | DEDICATED PET AREA'}
</div>

</div>

</div>
 
</section>



    {/* Snapshot Section */}
    <section className="relative bg-white py-20 px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            {/* Section Heading */}
            <div className="text-center mb-8">
              <p className="text-sm tracking-[0.3em] text-gray-600 mb-4">SNAPSHOT</p>
              <h2 className="text-3xl lg:text-3xl font-light tracking-wide text-[#B39248]">
                {property?.residences_title || (
                  <>
                    FEEL A SENSE OF PRIDE, EACH TIME<br />
                    YOU ENTER THE DOUBLE-HEIGHT<br />
                    LOBBY EN-ROUTE TO YOUR HOME.
                  </>
                )}
              </h2>
              <h3>
                {property?.residences_description ||
                  'The twin towers at Sapphire Residences seamlessly merge indoor and outdoor spaces, providing open views from each side. Tailored to meet contemporary preferences, these premium homes exceed expectations, embodying high quality specifications and timeless sophistication.'}
              </h3>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 mt-16">
              {/* Left - Image */}
              <div className="w-full">
                <img 
                  src={
                    property?.residences_img
                      ? property.residences_img
                      : "https://www.ameyagroup.in/sapphire-residences/static/media/Snapshot.b7a838f92b1b031f1fc8.webp"
                  }
                  alt="Sapphire Residences Aerial View"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right - Feature Grid (Dynamic - 3 per row) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-px bg-[#B39248] border border-[#B39248]">
                {residencesFeaturesList.map((feature, index) => {
                  // Last 2 items span 3 columns each (half width), others span 2 columns
                  const isLastRow = index >= residencesFeaturesList.length - 2;
                  const colSpan = isLastRow ? 'lg:col-span-3' : 'lg:col-span-2';
                  
                  return (
                    <div 
                      key={index} 
                      className={`bg-white p-6 flex items-center justify-center text-center min-h-[150px] ${colSpan} md:col-span-1`}
                    >
                      <p className="text-xs lg:text-sm tracking-wide leading-relaxed whitespace-pre-line uppercase">
                        {feature}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

{/* Living Room Section */}
<section className='bg-white'>

<div
  style={{
    backgroundImage: property?.living_room_bg_img
      ? `url(${property.living_room_bg_img})`
      : 'url("https://www.ameyagroup.in/sapphire-residences/static/media/green-hub.eb09f70bac027ecb85be.webp")',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    width: '80%',
    margin:'auto',
    height: '600px'
  }}
>

<div className='mx-auto text-center text-white relative'>
<div className='text-2xl absolute top-[30vh] lg:top-[70vh] left-0'>
<h2 className=''>
  {property?.living_room_title || 'ENGAGING GREEN HUB'}
</h2>
{property?.living_room_description ||
  'CENTRAL GREEN LANDSCAPING | SENIOR CITIZENS PARK KIDS’ PLAY AREA WITH EQUIPMENT | DEDICATED PET AREA'}
</div>

</div>

</div>
 
</section>

{/* Site plan Section */}
        {plansList.length > 0 && (
        <section className="relative bg-white py-20 px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            {/* Gallery Header */}
            <div className="relative mb-16">
              <h2 className="text-center text-gray-700 text-sm lg:text-base tracking-[0.3em] uppercase font-light mb-6">
                GALLERY
              </h2>
              <div className="absolute left-0 top-8 lg:top-10">
                <p className="text-left text-sm lg:text-base">
                  <span className="text-gray-400 font-light">Sapphire</span>
                  <span className="text-gray-700 font-light ml-2">Residences</span>
                </p>
              </div>
            </div>

            {/* Site Plan & Floor Plan Grid */}
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Vertical Divider Line */}
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 transform -translate-x-1/2"></div>

              {/* Left - First Plan */}
              <div className="flex flex-col">
                <h3 className="text-xl lg:text-2xl font-light tracking-wide text-gray-700 mb-8 text-center uppercase">
                  {plansList[0].name}
                </h3>
                <div className="bg-white w-full mb-6">
                  <img 
                    src={plansList[0].img}
                    alt={plansList[0].name || 'Plan'}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <button className="bg-[#4a4a4a] hover:bg-[#3a3a3a] text-white px-6 py-3 tracking-[0.15em] text-sm font-light transition-all duration-300 rounded-sm w-full lg:w-auto mx-auto">
                  {plansList[0].name ? `CLICK TO VIEW ${plansList[0].name.toUpperCase()}` : 'CLICK TO VIEW PLAN'}
                </button>
              </div>

              {/* Right - Second Plan (if available) */}
              {plansList.length > 1 && (
              <div className="flex flex-col">
                <h3 className="text-xl lg:text-2xl font-light tracking-wide text-gray-700 mb-8 text-center uppercase">
                  {plansList[1].name}
                </h3>
                <div className="bg-white w-full mb-6">
                  <img 
                    src={plansList[1].img}
                    alt={plansList[1].name || 'Plan'}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <button className="bg-[#4a4a4a] hover:bg-[#3a3a3a] text-white px-6 py-3 tracking-[0.15em] text-sm font-light transition-all duration-300 rounded-sm w-full lg:w-auto mx-auto">
                  {plansList[1].name ? `CLICK TO VIEW ${plansList[1].name.toUpperCase()}` : 'CLICK TO VIEW PLAN'}
                </button>
              </div>
              )}
            </div>
          </div>
        </section>
        )}

        {/* Location Section */}
        <section className="relative bg-white py-20 px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            {/* Text Section */}
            <div className="text-center mb-12">
              <p className="text-sm tracking-[0.3em] text-gray-400 mb-4 font-light uppercase">
                LOCATION
              </p>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-light leading-tight tracking-wide text-[#B39248] mb-6">
                {property?.location_title || (
                  <>
                    ENJOY THE LUXURY OF TIME AT<br />
                    GURUGRAM'S CENTRAL LOCATION
                  </>
                )}
              </h2>
              <p className="text-gray-700 text-base lg:text-lg max-w-4xl mx-auto leading-relaxed font-light">
                {property?.location_description ||
                  'The Sapphire Residences in Old Gurugram combine exceptional value with a comfortable lifestyle. Embrace the unbeatable advantages of affordability without compromising on quality.'}
              </p>
            </div>

            {/* Map Section */}
            <div className="relative mt-12">
              <div 
                className="relative w-full bg-[#f5f5dc] rounded-sm overflow-hidden"
                style={{ minHeight: '600px' }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => setIsDragging(false)}
              >
                {/* Map Image Container */}
                <div className="relative w-full h-full overflow-hidden">
                  <div 
                    className="w-full h-full"
                    style={{
                      transform: `translate(${mapPosition.x / mapZoom}px, ${mapPosition.y / mapZoom}px) scale(${mapZoom})`,
                      transformOrigin: 'center center',
                      transition: isDragging ? 'none' : 'transform 0.3s ease-in-out',
                      cursor: mapZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                    }}
                  >
                    <img 
                      src={
                        property?.location_img
                          ? property.location_img
                          : "https://www.ameyagroup.in/sapphire-residences/static/media/Snapshot.b7a838f92b1b031f1fc8.webp"
                      }
                      alt="Location Map - Sapphire Residences"
                      className="w-full h-auto object-contain pointer-events-none"
                      draggable="false"
                    />
                  </div>
                  
                  {/* Map Controls (Zoom in, Zoom out, Reset) */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-1">
                    <button 
                      onClick={handleZoomIn}
                      className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                      aria-label="Zoom in"
                    >
                      <span className="text-gray-700 text-xl font-light leading-none">+</span>
                    </button>
                    <button 
                      onClick={handleZoomOut}
                      className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                      aria-label="Zoom out"
                    >
                      <span className="text-gray-700 text-2xl font-light leading-none">−</span>
                    </button>
                    <button 
                      onClick={handleResetZoom}
                      className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                      aria-label="Reset zoom"
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>

                  {/* Sapphire Residences Pin (Positioned absolutely - adjust as needed based on actual map) */}
                  <div className="absolute" style={{ top: '45%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 5 }}>
                    <div className="relative flex flex-col items-center">
                      {/* Red Pin with Number */}
                      <div className="relative">
                        {/* Pin body - rectangular top with rounded corners */}
                        <div className="w-10 h-12 bg-red-600 rounded-t-lg relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-bold text-base">15</span>
                          </div>
                          {/* Pin point */}
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                            <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[12px] border-transparent border-t-red-600"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Logo Below Pin */}
                      <div className="mt-6 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <div className="w-5 h-5 bg-[#B39248]"></div>
                          <span className="text-[#B39248] font-light text-base lg:text-lg tracking-wide">SAPPHIRE</span>
                        </div>
                        <span className="text-[#B39248] font-light text-xs lg:text-sm tracking-wide">RESIDENCES</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Everything Within Reach & Neighbourhood Section */}
        {(property?.near_by_title || nearbyTimeList.length || nearbyLocationList.length || nearbyTextList.length) && (
        <section className="relative bg-white py-20 px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Left Column - Everything Within Reach */}
              <div>
                {property?.near_by_title && (
                  <h2 className="text-2xl lg:text-3xl font-serif text-[#B39248] mb-8 tracking-wide capitalize">
                    {property.near_by_title}
                  </h2>
                )}
                
                <div className="space-y-8">
                  {nearbyTimeList.length > 0 && (
                    <div>
                      <h3 className="text-base font-semibold text-gray-800 mb-4 uppercase tracking-wide">
                        Time
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {nearbyTimeList.map((item, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-medium text-gray-800 border border-[#B39248] px-3 py-1 uppercase tracking-wide"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {nearbyLocationList.length > 0 && (
                    <div>
                      <h3 className="text-base font-semibold text-gray-800 mb-4 uppercase tracking-wide">
                        Locations
                      </h3>
                      <ul className="space-y-1">
                        {nearbyLocationList.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-700 font-light">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Neighbourhood */}
              {nearbyTextList.length > 0 && (
              <div>
                <h2 className="text-2xl lg:text-3xl font-serif text-[#B39248] mb-8 tracking-wide">
                  Neighbourhood
                </h2>
                
                <div className="space-y-6">
                  {nearbyTextList.map((item, idx) => (
                    <div key={idx}>
                      <p className="text-base text-gray-700 font-light leading-relaxed">
                        {item}
                      </p>
                      {idx !== nearbyTextList.length - 1 && (
                        <div className="h-px bg-[#B39248] w-full mt-4"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>
          </div>
        </section>
        )}

        {/* Keywords Display */}
        <KeywordsDisplay />

    </>

  );
}