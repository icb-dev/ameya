import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import HomeSlider from "../components/HomeSlider";
import KeywordsDisplay from "../components/KeywordsDisplay";
import { sendContactForm } from "../utils/contactForm";
import bgimg from "../assets/images/bgimg.png";

const Home = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });
  const [popupImage, setPopupImage] = useState(null);
  const [popupImageLoading, setPopupImageLoading] = useState(true);

  const API_BASE = import.meta?.env?.VITE_API_BASE_URL || 'https://seagreen-porcupine-656193.hostingersite.com';
  const fallbackImage = bgimg;

  const logDebug = (...args) => {
    // simple debug logger for this page
    // eslint-disable-next-line no-console
    console.log('[Home]', ...args);
  };

  useEffect(() => {
    const fetchProps = async () => {
      setLoading(true);
      setError('');                                                                                             
      try {
        const res = await fetch(`${API_BASE}/api/admin/properties`, {
          credentials: 'include', // allow cookie if backend requires auth
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          logDebug('fetch properties failed', res.status, data);
          throw new Error(data.message || 'Failed to load properties');
        }
        const data = await res.json();
        logDebug('raw properties response', data);
        logDebug(
          'properties first items (with gallery)',
          (data?.properties || []).slice(0, 3).map((p) => ({
            id: p.id,
            status: p.status,
            title: p.title,
            gallery0: p.gallery?.[0],
            locationImage: p.locationImage,
          }))
        );
        if (!data?.properties || data.properties.length === 0) {
          logDebug('no properties returned from API');
        }
        setProperties(data.properties || []);
      } catch (err) {
        logDebug('error loading properties', err);
        setError(err.message || 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    };
    fetchProps();
  }, [API_BASE]);

  const formatLocation = (sector, state) => {
    const parts = [sector, state].filter(Boolean);
    return parts.join(', ') || 'Gurugram';
  };

  // Create URL-friendly slug from title
  const createSlug = (title) => {
    return encodeURIComponent(title.trim().toLowerCase().replace(/\s+/g, '-'));
  };

  // Resolve image URL to use /uploads assets served by backend
  const resolveImage = useCallback((path) => {
    if (!path) return null;
    const trimmed = String(path).trim();

    // If http(s), try to extract /uploads/ from pathname
    if (/^https?:\/\//i.test(trimmed)) {
      try {
        const u = new URL(trimmed);
        const p = u.pathname;
        const idx = p.lastIndexOf('/uploads/');
        if (idx !== -1) {
          return encodeURI(`${API_BASE}${p.substring(idx)}`);
        }
        return encodeURI(trimmed);
      } catch {
        // fall through
      }
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
  }, [API_BASE]);

  // Fetch popup image from API
  useEffect(() => {
    const fetchPopupImage = async () => {
      setPopupImageLoading(true);
      const endpoint = `${API_BASE}/api/popup-image/active`;
      logDebug('Fetching popup image from:', endpoint);
      
      try {
        const res = await fetch(endpoint);
        logDebug('Popup image API response status:', res.status);
        
        if (!res.ok) {
          logDebug('fetch popup image failed - status:', res.status);
          // Don't set to null, let it use fallback
          setPopupImageLoading(false);
          return;
        }
        
        const data = await res.json();
        logDebug('Popup image API response data:', data);
        
        // Handle different response formats
        let imageData = null;
        if (data.popupImage) {
          // Format: {popupImage: {...}}
          imageData = data.popupImage;
        } else if (data.status === 'success' && data.data) {
          // Format: {status: 'success', data: {...}}
          imageData = data.data;
        } else if (data.data && data.data.image) {
          // Direct data format
          imageData = data.data;
        } else if (data.image) {
          // Flat response format
          imageData = data;
        }
        
        if (imageData && imageData.image) {
          // Resolve image URL similar to other images
          const imagePath = imageData.image;
          const resolvedImage = resolveImage(imagePath);
          if (resolvedImage) {
            setPopupImage(resolvedImage);
            logDebug('Popup image loaded successfully:', resolvedImage);
          } else {
            logDebug('Failed to resolve image path:', imagePath);
            setPopupImage(null);
          }
        } else {
          logDebug('No active popup image found in response. Data structure:', data);
          setPopupImage(null);
        }
      } catch (err) {
        logDebug('Error loading popup image:', err.message || err);
        setPopupImage(null);
      } finally {
        setPopupImageLoading(false);
      }
    };
    fetchPopupImage();
  }, [API_BASE, resolveImage]);

  useEffect(() => {
    if (!properties || properties.length === 0) return;
    const logItems = properties.slice(0, 5).map((p) => {
      const chosen =
        resolveImage(p.gallery?.[0]) ||
        resolveImage(p.locationImage) ||
        fallbackImage;
      return { id: p.id, status: p.status, title: p.title, chosenImage: chosen, gallery0: p.gallery?.[0], locationImage: p.locationImage };
    });
    logDebug('image selection preview', logItems);
  }, [properties]);

  // Show popup after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContactPopup(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormMessage({ type: '', text: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormMessage({ type: '', text: '' });

    const result = await sendContactForm(formData, 'Home Page Contact Popup');

    if (result.success) {
      setFormMessage({ type: 'success', text: result.message });
      setFormData({ name: '', email: '', phone: '' });
      
      // Close popup after 2 seconds on success
      setTimeout(() => {
        setShowContactPopup(false);
      }, 2000);
    } else {
      setFormMessage({ type: 'error', text: result.message });
    }

    setFormSubmitting(false);
  };

  const closePopup = () => {
    setShowContactPopup(false);
  };

  const ongoingProjects = properties.filter((p) => p.status === 'ongoing');
  const completedProjects = properties.filter((p) => p.status === 'completed');

  return (

    <main>
      <div>
        <HomeSlider />
      </div>

      {/* Sapphire Chain Section */}
      <section className="py-12 px-6 md:p-20 relative overflow-hidden">
            <div className="max-w-4xl mx-auto">
          {/* Mobile: Single column centered, Desktop: Two column grid */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
            {/* Heading */}
            <div className="text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif leading-tight">
                The Sapphire Chain of Neighbourhood Bazaars
              </h2>
            </div>

            {/* Content */}
            <div className="space-y-4 md:space-y-6 text-center lg:text-left">
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                The story of Sapphire Neighbourhood Bazaars began in the year 2009, with the launch of The Sapphire in Sector 49, Gurugram. Its grand success led to the vision and roadmap for creating convenient local marketplaces across Gurugram.
              </p>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                Following the successful delivery of The Sapphire (in Sector 49), Sapphire 83, Sapphire 90 and Ameya One, the Ameya Group strides forward on its journey of developing neighbourhood markets.
              </p>
            </div>
          </div>

          {/* Background Illustration - Adjusted for mobile */}
          <div className="absolute top-[20%] md:top-1/2 left-1/2 lg:right-3/8 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[300px] md:h-[600px] opacity-100 md:opacity-40 pointer-events-none">
            <img 
              src={bgimg} 
              alt="" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* Ameya Group Projects Section */}
      <section className="py-16 px-6 md:py-20 md:px-10 bg-gray-100 relative overflow-hidden">
        {/* Decorative Dots - Left */}
        <div className="hidden lg:block absolute left-8 top-20 w-32 h-64 opacity-30">
          <svg viewBox="0 0 100 200" className="w-full h-full">
            {Array.from({ length: 10 }).map((_, row) =>
              Array.from({ length: 5 }).map((_, col) => (
                <circle
                  key={`left-${row}-${col}`}
                  cx={col * 25 + 10}
                  cy={row * 20 + 10}
                  r="2"
                  fill="#999"
                />
              ))
            )}
          </svg>
        </div>

        {/* Decorative Dots - Right */}
        <div className="hidden lg:block absolute right-8 top-20 w-32 h-64 opacity-30">
          <svg viewBox="0 0 100 200" className="w-full h-full">
            {Array.from({ length: 10 }).map((_, row) =>
              Array.from({ length: 5 }).map((_, col) => (
                <circle
                  key={`right-${row}-${col}`}
                  cx={col * 25 + 10}
                  cy={row * 20 + 10}
                  r="2"
                  fill="#999"
                />
              ))
            )}
          </svg>
        </div>

        <div className="max-w-2xl mx-auto relative z-10">
          {/* Section Heading */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-[3px] bg-orange-600 mr-4"></div>
            <h2 className="text-xl md:text-2xl font-light tracking-[0.3em] text-gray-800">
              AMEYA GROUP
            </h2>
          </div>

          {/* Tab Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`px-8 py-3 rounded-full text-sm font-semibold tracking-wider transition-all duration-300 ${
                activeTab === 'ongoing'
                  ? 'bg-blue-900 text-white'
                  : 'bg-transparent border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'
              }`}
            >
              ONGOING PROJECTS
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-8 py-3 rounded-full text-sm font-semibold tracking-wider transition-all duration-300 ${
                activeTab === 'completed'
                  ? 'bg-blue-900 text-white'
                  : 'bg-transparent border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'
              }`}
            >
              COMPLETED PROJECTS
            </button>
          </div>

          {/* Projects Grid */}
          {loading && (
            <div className="text-center text-sm text-gray-600">Loading properties...</div>
          )}

          {error && !loading && (
            <div className="text-center text-sm text-red-600">{error}</div>
          )}

          {!loading && !error && (
            <>
              {activeTab === 'ongoing' && ongoingProjects.length === 0 && (
                <div className="text-center text-sm text-gray-600">No ongoing projects.</div>
              )}
              {activeTab === 'completed' && completedProjects.length === 0 && (
                <div className="text-center text-sm text-gray-600">No completed projects.</div>
              )}

              {activeTab === 'ongoing' && ongoingProjects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {ongoingProjects.map((project) => {
                    const img =
                      resolveImage(project.gallery?.[0]) ||
                      resolveImage(project.locationImage) ||
                      fallbackImage;
                    return (
                      <Link 
                        key={project.id} 
                        to={`/property/${project.type}/${project.propertyTitle || createSlug(project.title)}`}
                        className="group relative overflow-hidden cursor-pointer shadow-lg rounded-lg bg-white hover:shadow-xl transition-shadow duration-300"
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                          {img ? (
                            <img
                              src={img}
                              alt={project.title}
                              className="w-full h-full object-cover brightness-95 group-hover:scale-105 transition-transform duration-700"
                              onError={(e) => {
                                logDebug('image load error (ongoing)', { id: project.id, src: img });
                                e.currentTarget.src = fallbackImage;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="p-4 space-y-1">
                          {project.propertyTitle ? (
                            <>
                              <h3 className="text-sm md:text-base font-semibold text-gray-900 uppercase">{project.propertyTitle}</h3>
                              <p className="text-xs uppercase text-gray-500">{formatLocation(project.sector, project.state)}</p>
                              <p className="text-xs text-gray-600">{project.title}</p>
                            </>
                          ) : (
                            <>
                              <p className="text-xs uppercase text-gray-500">{formatLocation(project.sector, project.state)}</p>
                              <h3 className="text-sm md:text-base font-semibold text-gray-900">{project.title}</h3>
                            </>
                          )}
                          {/* <p className="text-xs text-gray-600 truncate">{project.titleDescription}</p> */}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {activeTab === 'completed' && completedProjects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {completedProjects.map((project) => {
                    const img =
                      resolveImage(project.gallery?.[0]) ||
                      resolveImage(project.locationImage) ||
                      fallbackImage;
                    return (
                      <Link 
                        key={project.id} 
                        to={`/property/${project.type}/${project.propertyTitle || createSlug(project.title)}`}
                        className="group relative overflow-hidden cursor-pointer shadow-lg rounded-lg bg-white hover:shadow-xl transition-shadow duration-300"
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                          {img ? (
                            <img
                              src={img}
                              alt={project.title}
                              className="w-full h-full object-cover brightness-95 group-hover:scale-105 transition-transform duration-700"
                              onError={(e) => {
                                logDebug('image load error (completed)', { id: project.id, src: img });
                                e.currentTarget.src = fallbackImage;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="p-4 space-y-1">
                          {project.propertyTitle ? (
                            <>
                              <h3 className="text-sm md:text-base font-semibold text-gray-900 uppercase">{project.propertyTitle}</h3>
                              <p className="text-xs uppercase text-gray-500">{formatLocation(project.sector, project.state)}</p>
                              <p className="text-xs text-gray-600">{project.title}</p>
                            </>
                          ) : (
                            <>
                              <p className="text-xs uppercase text-gray-500">{formatLocation(project.sector, project.state)}</p>
                              <h3 className="text-sm md:text-base font-semibold text-gray-900">{project.title}</h3>
                            </>
                          )}
                          {/* <p className="text-xs text-gray-600 truncate">{project.titleDescription}</p> */}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* View All Projects Link */}
          <div className="mt-12 text-center">
            <a 
              href="/projects" 
              className="inline-block text-sm font-semibold tracking-widest uppercase border-b-2 border-gray-800 pb-2 hover:border-orange-600 hover:text-orange-600 transition-colors duration-300"
            >
              VIEW ALL PROJECTS
            </a>
          </div>
        </div>
      </section>

      {/* Most Trusted Group Section */}
      <section className="py-16 px-6 md:py-20 md:px-10 relative overflow-hidden">
        {/* Decorative Dots - Right */}
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

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Image */}
            <div>
              <div className="overflow-hidden">
                {(() => {
                  const trustedImage = resolveImage(properties[0]?.locationImage) || resolveImage(properties[0]?.gallery?.[0]) || fallbackImage;
                  return (
                    <img
                      src="/img/homestatic.jpg"
                      alt="Ameya Building"
                      className="w-full h-auto object-cover"
                    />
                  );
                })()}
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-3xl lg:text-5xl font-serif">
                The Most Trusted Group for Neighbourhood Bazaars
              </h2>
              
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                Ameya is a professional real estate group based in Gurugram, focused on the development of retail and commercial projects across the city. Driven towards bringing the highest quality of real estate in major business zones and establishing commercial and retail spaces in lucrative locations, Ameya strives to provide maximum value to its esteemed clients. It ensures timely delivery of all projects, with an execution that reflects uncompromised quality.
              </p>

              <div>
                <a 
                  href="/about" 
                  className="inline-block text-sm font-semibold tracking-widest uppercase border-b-2 border-gray-800 pb-2 hover:border-orange-600 hover:text-orange-600 transition-colors duration-300"
                >
                  READ MORE
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <div className="flex justify-center align-middle items-center h-[100vh]">
        <img className="w-full h-full object-contain" src="../assets/images/bgimg.png" ></img>
      </div> */}

      {/* Contact Popup */}
      {showContactPopup && (
        <div 
          id="contactPopup"
          className="fixed z-[9999] left-0 top-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target.id === 'contactPopup') {
              closePopup();
            }
          }}
        >
          <div 
            id="popupContent"
            className="bg-white w-full max-w-[900px] rounded-[15px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Side - Image */}
            <div className="flex-1 bg-[#28659b] flex items-center justify-center p-0 min-h-[250px] md:min-h-[500px] overflow-hidden">
              {popupImageLoading ? (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-sm">Loading...</div>
                </div>
              ) : popupImage ? (
                <img 
                  key={popupImage} 
                  src={popupImage} 
                  alt="Contact Ameya"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to default image if dynamic image fails to load
                    logDebug('Popup image failed to load, using fallback. Attempted URL:', e.currentTarget.src);
                    if (e.currentTarget.src !== '/img/contact.jpg' && e.currentTarget.src !== '/img/homestatic.jpg') {
                      e.currentTarget.src = '/img/contact.jpg';
                    } else if (e.currentTarget.src !== '/img/homestatic.jpg') {
                      e.currentTarget.src = '/img/homestatic.jpg';
                    }
                  }}
                  onLoad={() => {
                    logDebug('Popup image loaded successfully from:', popupImage);
                  }}
                />
              ) : (
                <img 
                  src="/img/contact.jpg" 
                  alt="Contact Ameya"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/img/homestatic.jpg';
                  }}
                />
              )}
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 p-10 bg-white relative">
              <button
                className="absolute top-[15px] right-[15px] w-[35px] h-[35px] bg-[#f0f0f0] border-none rounded-full cursor-pointer flex items-center justify-center text-xl text-[#333] transition-all duration-300 z-10 hover:bg-[#28659b] hover:text-white hover:rotate-90"
                onClick={closePopup}
                type="button"
              >
                &times;
              </button>

              <h5 className="text-[#28659b] text-2xl mb-5 font-semibold">Contact Information</h5>

              <form onSubmit={handleFormSubmit}>
                <div className="mb-5">
                  <label className="block text-[#333] font-medium mb-2 text-sm">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full py-3 px-4 border-2 border-[#e0e0e0] rounded-lg text-sm transition-all duration-300 focus:outline-none focus:border-[#28659b] focus:shadow-[0_0_0_3px_rgba(40,101,155,0.1)]"
                    required
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-[#333] font-medium mb-2 text-sm">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full py-3 px-4 border-2 border-[#e0e0e0] rounded-lg text-sm transition-all duration-300 focus:outline-none focus:border-[#28659b] focus:shadow-[0_0_0_3px_rgba(40,101,155,0.1)]"
                    required
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-[#333] font-medium mb-2 text-sm">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full py-3 px-4 border-2 border-[#e0e0e0] rounded-lg text-sm transition-all duration-300 focus:outline-none focus:border-[#28659b] focus:shadow-[0_0_0_3px_rgba(40,101,155,0.1)]"
                    required
                  />
                </div>

                {formMessage.text && (
                  <div
                    className={`mb-4 px-3 py-2 text-sm rounded ${
                      formMessage.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {formMessage.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full py-3 px-5 border-none rounded-lg text-base font-medium cursor-pointer transition-all duration-300 bg-[#28659b] text-white hover:bg-[#1e4d75] hover:translate-y-[-2px] hover:shadow-[0_5px_15px_rgba(40,101,155,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        </div>
          )}

      {/* Keywords Display */}
      <KeywordsDisplay />
    </main>
    
  );
};

export default Home;
