import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bgimg from '../assets/images/bgimg.png';

const Projects = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [commercialPage, setCommercialPage] = useState(0);
  const [commercialProjects, setCommercialProjects] = useState([]);
  const [residentialProjects, setResidentialProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resLoading, setResLoading] = useState(true);
  const [resError, setResError] = useState('');

  const API_BASE = import.meta?.env?.VITE_API_BASE_URL || 'https://seagreen-porcupine-656193.hostingersite.com';
  const fallbackImage = bgimg;

  // Fetch commercial projects from API
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/api/admin/properties`, {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Failed to load properties');
        }
        const data = await res.json();
        
        // Filter commercial properties by status
        const commercial = (data.properties || []).filter(
          (p) => p.type === 'commercial' && p.status === activeTab
        );
        
        setCommercialProjects(commercial);
      } catch (err) {
        setError(err.message || 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [activeTab, API_BASE]);

  // Fetch residential properties (Sapphire Residences data)
  useEffect(() => {
    const fetchResidential = async () => {
      setResLoading(true);
      setResError('');
      try {
        const res = await fetch(`${API_BASE}/api/admin/residence-properties`, {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Failed to load residential properties');
        }
        const data = await res.json();
        const list = Array.isArray(data?.properties)
          ? data.properties
          : Array.isArray(data)
          ? data
          : [];
        setResidentialProjects(list);
      } catch (err) {
        setResError(err.message || 'Failed to load residential properties');
      } finally {
        setResLoading(false);
      }
    };

    fetchResidential();
  }, [API_BASE]);

  // Resolve image URL to use /uploads assets served by backend
  const resolveImage = (path) => {
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
  };

  // Create URL-friendly slug from title
  const createSlug = (title) => {
    return encodeURIComponent(title.trim().toLowerCase().replace(/\s+/g, '-'));
  };

  // Format location from sector and state
  const formatLocation = (sector, state) => {
    const parts = [sector, state].filter(Boolean);
    return parts.join(', ') || 'Gurugram';
  };

  // Get project image (banner, gallery[0], or locationImage)
  const getProjectImage = (project) => {
    return resolveImage(project.banner) || 
           resolveImage(project.gallery?.[0]) || 
           resolveImage(project.locationImage) || 
           fallbackImage;
  };

  // Get residential image (prefer residences_img, then address_img, then banner_background)
  const getResidentialImage = (item) => {
    return (
      resolveImage(item.residences_img) ||
      resolveImage(item.address_img) ||
      resolveImage(item.banner_background) ||
      fallbackImage
    );
  };

  const itemsPerView = 3;

  // Calculate total pages for carousel
  const commercialTotalPages = Math.ceil(commercialProjects.length / itemsPerView);

  // Reset carousel page when tab changes
  useEffect(() => {
    setCommercialPage(0);
  }, [activeTab]);

  // Commercial carousel navigation - slides by sets of 3 items
  const nextCommercial = () => {
    setCommercialPage((prev) => (prev + 1) % commercialTotalPages);
  };

  const prevCommercial = () => {
    setCommercialPage((prev) => (prev === 0 ? commercialTotalPages - 1 : prev - 1));
  };

  return (
    <main className="bg-white">
      {/* Breadcrumb Navigation */}
      <section className="py-6 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900 transition-colors">HOME</Link>
            <span>&gt;</span>
            <span className="text-gray-900">OUR PROJECTS</span>
          </nav>
        </div>
      </section>

      {/* Ameya Projects Introduction Section */}
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
                  key={`intro-dots-${row}-${col}`}
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

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Section Title */}
          <div className="mb-12 md:mb-16">
            <div className="inline-block">
              <h1 className="text-xs md:text-sm uppercase tracking-[0.3em] text-gray-600 mb-2">
                AMEYA PROJECTS
              </h1>
              <div className="w-16 h-[2px] bg-red-700 mx-auto"></div>
            </div>
          </div>

          {/* Description */}
          <div className="max-w-4xl mx-auto">
            <p className="text-sm md:text-base leading-relaxed text-gray-800">
              Driven towards bringing the highest quality of real estate in major business zones and establishing commercial and retail spaces in lucrative locations, Ameya strives to provide maximum value to its esteemed clients. It ensures timely delivery of all projects, with an execution that reflects uncompromised quality.
            </p>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`px-8 py-3 rounded-full text-sm md:text-base font-medium transition-all ${
                activeTab === 'ongoing'
                  ? 'bg-blue-800 text-white'
                  : 'bg-white text-gray-900 border-2 border-gray-900'
              }`}
            >
              ONGOING
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-8 py-3 rounded-full text-sm md:text-base font-medium transition-all ${
                activeTab === 'completed'
                  ? 'bg-blue-800 text-white'
                  : 'bg-white text-gray-900 border-2 border-gray-900'
              }`}
            >
              COMPLETED
            </button>
          </div>
        </div>
      </section>

      {/* Commercial Projects Section */}
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
                      key={`commercial-dots-${row}-${col}`}
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-blue-800 leading-tight">
              COMMERCIAL PROJECTS
            </h2>
          </div>

          {/* Commercial Projects Carousel */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading projects...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : commercialProjects.length > 0 ? (
            <div className="relative">
              {/* Carousel Container */}
              <div className="relative overflow-hidden px-4 md:px-8">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${commercialPage * 100}%)` }}
                >
                  {commercialProjects.map((project) => {
                    const projectImage = getProjectImage(project);
                    const projectLocation = formatLocation(project.sector, project.state);
                    const projectSlug = project.propertyTitle || createSlug(project.title);
                    
                    return (
                      <div 
                        key={project.id} 
                        className="flex-shrink-0 px-3" 
                        style={{ width: `${100 / itemsPerView}%` }}
                      >
                        <Link 
                          to={`/property/commercial/${projectSlug}`}
                          className="max-w-xs mx-auto group block"
                        >
                          <div className="aspect-[5/6] overflow-hidden mb-3 relative cursor-pointer">
                            <img
                              src={projectImage}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              onError={(e) => {
                                e.currentTarget.src = fallbackImage;
                              }}
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/[0.15] group-hover:bg-black/[0.75] transition-all duration-300 flex items-center justify-center p-4">
                              <div className="w-full max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="space-y-4">
                                  {/* LOCATION */}
                                  <div>
                                    <p className="text-xs uppercase text-white font-bold tracking-wider mb-2">LOCATION</p>
                                    <p className="text-sm text-white">{projectLocation}</p>
                                    <div className="h-px bg-gray-500 mt-3"></div>
                                  </div>
                                  
                                  {/* PROPERTY TYPE */}
                                  <div>
                                    <p className="text-xs uppercase text-white font-bold tracking-wider mb-2">PROPERTY TYPE</p>
                                    <p className="text-sm text-white capitalize">{project.type}</p>
                                    <div className="h-px bg-gray-500 mt-3"></div>
                                  </div>
                                  
                                  {/* STATUS */}
                                  <div>
                                    <p className="text-xs uppercase text-white font-bold tracking-wider mb-2">STATUS</p>
                                    <p className="text-sm text-white capitalize">{project.status}</p>
                                    <div className="h-px bg-gray-500 mt-3"></div>
                                  </div>
                                  
                                  {/* RERA NO. */}
                                  <div>
                                    <p className="text-xs uppercase text-white font-bold tracking-wider mb-2">RERA NO.</p>
                                    <p className="text-sm text-white">{project.reraNumber || 'N/A'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-center">
                            {project.propertyTitle ? (
                              <>
                                <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1 uppercase">
                                  {project.propertyTitle}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-700">
                                  {projectLocation}
                                </p>
                              </>
                            ) : (
                              <>
                                <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                                  {project.title}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-700">
                                  {projectLocation}
                                </p>
                              </>
                            )}
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Arrows */}
              {commercialProjects.length > itemsPerView && (
                <>
                  <button
                    onClick={prevCommercial}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-transparent hover:bg-gray-100 rounded-full p-2 transition-colors z-20"
                    aria-label="Previous project"
                  >
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextCommercial}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent hover:bg-gray-100 rounded-full p-2 transition-colors z-20"
                    aria-label="Next project"
                  >
                    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No {activeTab} commercial projects found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Residential Projects Section */}
      <section className="py-16 md:py-20 lg:py-24 px-6 md:px-10 bg-white relative overflow-hidden">
        {/* Decorative Circle Dots - Right Side */}
        <div className="hidden lg:block absolute right-8 top-1/4 w-48 h-48 opacity-10">
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
                      key={`residential-dots-${row}-${col}`}
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-blue-800 leading-tight">
              RESIDENTIAL PROJECTS
            </h2>
          </div>

          {resLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading residential projects...</p>
            </div>
          ) : resError ? (
            <div className="text-center py-12">
              <p className="text-red-600">{resError}</p>
            </div>
          ) : residentialProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {residentialProjects.map((item) => {
                const image = getResidentialImage(item);
                const title = item.banner_title || item.address_title || 'Residence';
                const location = item.banner_location || 'Gurugram';
                const slug = createSlug(title);

                return (
                  <Link
                    key={item.id}
                    to={`/property/residential/${slug}`}
                    className="group block bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="aspect-[5/6] overflow-hidden relative">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = fallbackImage;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/[0.15] group-hover:bg-black/[0.4] transition-colors duration-300" />
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                        {title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-700 mb-3">
                        {location}
                      </p>
                      <p className="text-[11px] md:text-xs text-gray-600 uppercase tracking-[0.2em]">
                        VIEW RESIDENCE
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No residential projects found.</p>
            </div>
          )}
        </div>
      </section>

    </main>
  );
};

export default Projects;

