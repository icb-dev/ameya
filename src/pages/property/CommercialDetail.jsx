import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import KeywordsDisplay from "../../components/KeywordsDisplay";
import bgimg from "../../assets/images/bgimg.png";
import {
  FaBuilding,
  FaCity,
  FaStore,
  FaHospital,
  FaArrowUp,
  FaRoute,
  FaArrowCircleUp,
  FaParking,
  FaVideo,
  FaShieldAlt,
  FaBolt,
  FaSnowflake,
  FaRoad,
  FaFireExtinguisher,
  FaExclamationTriangle,
  FaWheelchair,
  FaSign,
  FaTree,
  FaWifi,
  FaBriefcase,
  FaLightbulb,
  FaTrashAlt,
} from "react-icons/fa";

const CommercialDetail = () => {
  const { title } = useParams(); // This is now propertyTitle from URL
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });
  const [hoveredMixIndex, setHoveredMixIndex] = useState(null);

  const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "https://seagreen-porcupine-656193.hostingersite.com";
  const fallbackImage = bgimg;

  // Resolve image URL - always use full URLs
  // Note: Browsers allow loading images from different origins for display without CORS
  const resolveImage = (path) => {
    if (!path) return null;
    let trimmed = String(path).trim();

    // Decode if already encoded to avoid double-encoding
    try {
      if (trimmed.includes('%')) {
        trimmed = decodeURIComponent(trimmed);
      }
    } catch {
      // If decoding fails, use original
    }

    if (/^https?:\/\//i.test(trimmed)) {
      try {
        const u = new URL(trimmed);
        const p = u.pathname;
        const idx = p.lastIndexOf("/uploads/");
        if (idx !== -1) {
          // Reconstruct URL with proper encoding
          const relativePath = p.substring(idx);
          return `${API_BASE}${relativePath}`;
        }
        // Already a full URL, return as-is
        return trimmed;
      } catch {
        // fall through
      }
    }

    if (trimmed.startsWith("/uploads")) {
      return `${API_BASE}${trimmed}`;
    }

    const idxFs = trimmed.lastIndexOf("/uploads/");
    if (idxFs !== -1) {
      return `${API_BASE}${trimmed.substring(idxFs)}`;
    }

    const idxWin = trimmed.lastIndexOf("\\uploads\\");
    if (idxWin !== -1) {
      const relativePath = trimmed
        .substring(idxWin)
        .replace(/\\\\/g, "/")
        .replace(/\\/g, "/");
      return `${API_BASE}${relativePath}`;
    }

    return `${API_BASE}/uploads/${trimmed.replace(/^uploads[\\/]/, "")}`;
  };

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError("");
      try {
        // Try fetching by propertyTitle first, then fallback to fetching all and matching by title
        const encodedTitle = encodeURIComponent(title);
        let res = await fetch(`${API_BASE}/api/admin/properties/by-title/${encodedTitle}`, {
          credentials: "include",
        });
        
        // If not found by propertyTitle, fallback to fetching all properties and matching by title
        if (!res.ok || res.status === 404) {
          // Fallback: fetch all properties and find by matching title
          res = await fetch(`${API_BASE}/api/admin/properties`, {
            credentials: "include",
          });
          
          if (!res.ok) {
            throw new Error("Failed to load properties");
          }
          
          const data = await res.json();
          
          // Match by propertyTitle first, then by title slug
          const foundProperty = data.properties?.find((p) => {
            if (p.type !== 'commercial') return false;
            
            // Try matching by propertyTitle
            if (p.propertyTitle && p.propertyTitle.toLowerCase() === title.toLowerCase()) {
              return true;
            }
            
            // Fallback: match by title slug
            const titleSlug = p.title.trim().toLowerCase().replace(/\s+/g, '-');
            const urlTitle = decodeURIComponent(title).trim().toLowerCase();
            return titleSlug === urlTitle;
          });
          
          if (!foundProperty) {
            setError("Commercial property not found");
            return;
          }
          
          setProperty(foundProperty);
          return;
        }
        
        const data = await res.json();
        
        if (!data.property) {
          setError("Commercial property not found");
          return;
        }
        
        setProperty(data.property);
      } catch (err) {
        setError(err.message || "Failed to load property");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [title, API_BASE]);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormMessage({ type: "", text: "" });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormMessage({ type: "", text: "" });

    try {
      // Use the mail.php endpoint with page tracking
      const requestFrom = `Commercial Property: ${property?.title || 'Unknown Property'}`;
      
      const res = await fetch('https://seagreen-porcupine-656193.hostingersite.com/mail.php', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: 'not-provided@ameyagroup.in', // Commercial form doesn't have email, but mail.php requires it
          phone: formData.mobile.trim(),
          request_from: requestFrom,
          page_url: window.location.href,
        }),
      });

      const data = await res.json().catch(async () => {
        const text = await res.text();
        throw new Error(text || 'Failed to parse response');
      });

      if (data.status === 'success') {
        setFormMessage({ type: "success", text: "Thank you! We'll contact you soon." });
        setFormData({ name: "", mobile: "" });
      } else {
        throw new Error(data.message || "Failed to submit form");
      }
    } catch (err) {
      setFormMessage({ type: "error", text: err.message || "Failed to submit. Please try again." });
    } finally {
      setFormSubmitting(false);
    }
  };

  const formatLocation = (sector, state) => {
    const parts = [sector, state].filter(Boolean);
    return parts.join(", ") || "Gurugram";
  };

  // Map amenity text to appropriate icon
  const getAmenityIcon = (amenityText) => {
    const text = amenityText.toLowerCase();
    const iconColor = '#EA8808';
    
    if (text.includes('commercial development') || text.includes('sq. ft.')) {
      return <FaBuilding color={iconColor} />;
    }
    if (text.includes('architectural') || text.includes('façade')) {
      return <FaCity color={iconColor} />;
    }
    if (text.includes('retail')) {
      return <FaStore color={iconColor} />;
    }
    if (text.includes('medizone') || text.includes('medical')) {
      return <FaHospital color={iconColor} />;
    }
    if (text.includes('escalator')) {
      return <FaArrowUp color={iconColor} />;
    }
    if (text.includes('travelator') || text.includes('movement')) {
      return <FaRoute color={iconColor} />;
    }
    if (text.includes('elevator')) {
      return <FaArrowCircleUp color={iconColor} />;
    }
    if (text.includes('parking') || text.includes('car')) {
      return <FaParking color={iconColor} />;
    }
    if (text.includes('entry') || text.includes('exit') || text.includes('traffic')) {
      return <FaRoute color={iconColor} />;
    }
    if (text.includes('cctv') || text.includes('surveillance')) {
      return <FaVideo color={iconColor} />;
    }
    if (text.includes('security') || text.includes('manned')) {
      return <FaShieldAlt color={iconColor} />;
    }
    if (text.includes('power backup') || text.includes('backup')) {
      return <FaBolt color={iconColor} />;
    }
    if (text.includes('air-conditioning') || text.includes('air conditioning') || text.includes('ac')) {
      return <FaSnowflake color={iconColor} />;
    }
    if (text.includes('corridor') || text.includes('walkway')) {
      return <FaRoad color={iconColor} />;
    }
    if (text.includes('fire fighting') || text.includes('fire')) {
      return <FaFireExtinguisher color={iconColor} />;
    }
    if (text.includes('smoke detector') || text.includes('sprinkler')) {
      return <FaExclamationTriangle color={iconColor} />;
    }
    if (text.includes('wheelchair') || text.includes('ramp')) {
      return <FaWheelchair color={iconColor} />;
    }
    if (text.includes('signage') || text.includes('branding')) {
      return <FaSign color={iconColor} />;
    }
    if (text.includes('landscaped') || text.includes('open area') || text.includes('seating')) {
      return <FaTree color={iconColor} />;
    }
    if (text.includes('internet') || text.includes('telecom')) {
      return <FaWifi color={iconColor} />;
    }
    if (text.includes('facility') || text.includes('management') || text.includes('property management')) {
      return <FaBriefcase color={iconColor} />;
    }
    if (text.includes('lighting') || text.includes('energy')) {
      return <FaLightbulb color={iconColor} />;
    }
    if (text.includes('waste') || text.includes('sanitation')) {
      return <FaTrashAlt color={iconColor} />;
    }
    
    // Default icon
    return <FaBuilding color={iconColor} />;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-white pt-20">
          <div className="text-center">
            <p className="text-lg text-gray-700">Loading property details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-white pt-20">
          <div className="text-center space-y-4">
            <p className="text-lg text-red-600">{error || "Property not found"}</p>
          </div>
        </div>
      </>
    );
  }

  const bannerImage = resolveImage(property.banner) || 
                     resolveImage(property.gallery?.[0]) || 
                     resolveImage(property.locationImage) || 
                     fallbackImage;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-20 overflow-x-hidden">
        {/* Banner Section with Registration Form - Split Layout */}
        <div className="w-full min-h-[90vh] flex flex-col lg:flex-row relative">
          {/* Left Side - Banner Image (2/3 width) */}
          <div className="w-full lg:w-2/3 h-[50vh] lg:h-[90vh] relative overflow-hidden">
            <img
              src={bannerImage}
              alt={property.title || "Property Banner"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
            />
            
            {/* Breadcrumbs - Bottom Left */}
            <div className="absolute bottom-6 left-6 z-10">
              <div className="flex items-center gap-2 text-sm text-white">
                <Link to="/" className="hover:underline">HOME</Link>
                <span>/</span>
                <Link to="/" className="hover:underline">OUR PROJECTS</Link>
                <span>/</span>
                <span className="uppercase">{property.title}</span>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form Panel (1/3 width) */}
          <div className="w-full lg:w-1/3 bg-gray-200 flex flex-col">
            {/* Logo Section */}
            <div className="px-8 pt-8 pb-6">
              <div className="flex flex-col items-start gap-2">
                {property.logo ? (
                  <img
                    src={resolveImage(property.logo)}
                    alt={property.title}
                    className="h-12 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    {/* Simple logo placeholder - interconnected loops */}
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-8 border-2 border-teal-600 rounded-full"></div>
                      <div className="w-8 h-8 border-2 border-teal-600 rounded-full -ml-4"></div>
                    </div>
                  </div>
                )}
                <h2 className="text-2xl font-bold text-gray-800 uppercase">
                  {property.title}
                </h2>
                <p className="text-xs text-gray-600 uppercase tracking-wide">
                  {formatLocation(property.sector, property.state)}
                </p>
              </div>
            </div>

            {/* Registration Form */}
            <div className="flex-1 px-8 pb-8 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-6 text-center uppercase tracking-wide">
                  Register Your Interest
                </h3>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="NAME*"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-[#2d5a5a] text-white placeholder-gray-300 rounded-none border border-[#1a3a3a] focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm uppercase tracking-wide"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="MOBILE NO*"
                      value={formData.mobile}
                      onChange={handleFormChange}
                      required
                      pattern="[0-9]{10}"
                      className="w-full px-4 py-3 bg-[#2d5a5a] text-white placeholder-gray-300 rounded-none border border-[#1a3a3a] focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm uppercase tracking-wide"
                    />
                  </div>

                  {formMessage.text && (
                    <div
                      className={`text-sm px-3 py-2 ${
                        formMessage.type === "success"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {formMessage.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full px-4 py-3 bg-black text-white font-bold uppercase tracking-wide hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {formSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </div>

              {/* HRERA Disclaimer */}
              {/* <div className="mt-8 pt-6 border-t border-gray-400">
                <p className="text-xs text-gray-600 text-center">
                  {property.reraNumber 
                    ? `HRERA(REG.) ${property.reraNumber}${property.reraDate ? ` DATED ${property.reraDate}` : ''}`
                    : property.reraNumber || "HRERA Registration Pending"}
                </p>
              </div> */}
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="w-full bg-white py-16 px-6 lg:px-16">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm">
                <Link to="/" className="text-blue-600 hover:underline">HOME</Link>
                <span className="text-gray-400">/</span>
                <Link to="/" className="text-blue-600 hover:underline">OUR PROJECTS</Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-700 uppercase">{property.title}</span>
              </div>
            </div>

            {/* Section Title with Line - Centered */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-0.5 bg-[#8B4513]"></div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">OVERVIEW</h2>
            </div>

            {/* Main Heading - Centered */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-serif text-gray-900 text-center leading-tight">
                {property.title}
              </h1>
            </div>

            {/* Description Text Block - Centered */}
            {property.titleDescription && (
              <div className="max-w-4xl mx-auto">
                <p className="text-base lg:text-lg text-gray-800 leading-relaxed text-center font-sans">
                  {property.titleDescription}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Amenities Section */}
        {property.amenities && (
          <div className="w-full bg-white py-16 px-6 lg:px-16">
            <div className="max-w-6xl mx-auto">
              {/* Section Title with Line - Centered */}
              <div className="flex items-center justify-center gap-3 mb-12">
                <div className="w-12 h-0.5 bg-[#8B4513]"></div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">AMENITIES</h2>
              </div>

              {/* Amenities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {property.amenities.split('\n').filter(amenity => amenity.trim()).map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {/* Amenity Icon */}
                    <div className="flex-shrink-0 mt-0.5 text-[#EA8808] text-xl">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span className="text-gray-800 font-medium">{amenity.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* THE MIX Section */}
        {property.mix && property.mix.length > 0 && (
          <div className="w-full bg-white py-16 px-6 lg:px-16 relative overflow-hidden">
            {/* Decorative Dotted Circle - Left */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20 hidden lg:block">
              <svg width="120" height="120" viewBox="0 0 120 120" className="text-gray-300">
                <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              </svg>
            </div>

            {/* Decorative Wavy Line - Right */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 hidden lg:block">
              <svg width="40" height="12" viewBox="0 0 40 12" className="text-gray-400">
                <path
                  d="M0,6 L10,0 L20,6 L30,0 L40,6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
              {/* Section Title with Line - Centered */}
              <div className="flex items-center justify-center gap-3 mb-12">
                <div className="w-12 h-0.5 bg-[#8B4513]"></div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">THE MIX</h2>
              </div>

              {/* Mix Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {property.mix.map((mixItem, index) => {
                  const mixImage = resolveImage(mixItem.image_path || mixItem.image);
                  const mixText = mixItem.text_content || mixItem.text || '';
                  const mixLabel = mixItem.label || mixItem.title || `The Mix ${index + 1}`;

                  return (
                    <div
                      key={index}
                      className="relative group cursor-pointer"
                      onMouseEnter={() => setHoveredMixIndex(index)}
                      onMouseLeave={() => setHoveredMixIndex(null)}
                    >
                      {/* Image Container */}
                      <div className="relative w-full aspect-[2/3]  overflow-hidden bg-gray-200">
                        <img
                          src={mixImage || fallbackImage}
                          alt={mixLabel}
                          className="w-full h-full object-cover  transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = fallbackImage;
                          }}
                        />
                        
                        {/* Label Overlay - Bottom */}
                        <div className="absolute bottom-0 left-0 right-0 bg-[#4a5568] px-4 py-3">
                          <p className="text-white font-medium text-sm uppercase tracking-wide text-center">
                            {mixLabel}
                          </p>
                        </div>
                      </div>

                      {/* Hover Overlay Card - Shows text_content */}
                      {hoveredMixIndex === index && mixText && (
                        <div className="absolute inset-0 z-20 flex flex-col justify-between transition-opacity duration-300">
                          {/* Dark Overlay with subtle background image */}
                          <div className="absolute inset-0 bg-black bg-opacity-85"></div>
                          <div 
                            className="absolute inset-0 opacity-20"
                            style={{
                              backgroundImage: `url(${mixImage || fallbackImage})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                          ></div>
                          
                          {/* Content */}
                          <div className="relative z-10 flex flex-col justify-between h-full p-6">
                            {/* Text Content - Top */}
                            <div className="flex-1 flex items-start pt-4">
                              <p className="text-white text-sm leading-relaxed text-left">
                                {mixText}
                              </p>
                            </div>

                            {/* Button - Bottom */}
                            <button className="w-full bg-[#2563eb] text-white font-bold uppercase tracking-wide py-3 px-4 text-sm hover:bg-[#1d4ed8] transition-colors mt-4">
                              {mixLabel}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* LOCATION Section */}
        {(property.locationImage || property.location_image) && (
          <div className="w-full bg-white py-16 px-6 lg:px-16 relative overflow-hidden">
            {/* Decorative Dotted Circle - Left */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20 hidden lg:block">
              <svg width="120" height="120" viewBox="0 0 120 120" className="text-gray-300">
                <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              </svg>
            </div>

            {/* Decorative Dotted Circle - Right */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 hidden lg:block">
              <svg width="120" height="120" viewBox="0 0 120 120" className="text-gray-300">
                <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              </svg>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
              {/* Section Title with Line - Centered */}
              <div className="flex items-center justify-center gap-3 mb-12">
                <div className="w-12 h-0.5 bg-[#8B4513]"></div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">LOCATION</h2>
              </div>

              {/* Map Image */}
              <div className="mb-8">
                <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={resolveImage(property.locationImage || property.location_image) || fallbackImage}
                    alt={`${property.title} Location Map`}
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                </div>
              </div>

              {/* Call to Action Button */}
              <div className="text-center">
                <button
                  onClick={() => {
                    const mapUrl = resolveImage(property.locationImage || property.location_image);
                    if (mapUrl) {
                      window.open(mapUrl, '_blank');
                    }
                  }}
                  className="text-gray-800 hover:text-gray-900 uppercase tracking-wide text-sm font-medium transition-colors cursor-pointer"
                >
                  CLICK TO VIEW LOCATION MAP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GALLERY Section */}
        {property.gallery && property.gallery.length > 0 && (
          <div className="w-full bg-white py-16 px-6 lg:px-16 relative overflow-hidden">
            {/* Decorative Zigzag Line - Left */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 hidden lg:block">
              <svg width="40" height="12" viewBox="0 0 40 12" className="text-gray-300">
                <path
                  d="M0,6 L10,0 L20,6 L30,0 L40,6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
              {/* Section Title with Line - Centered */}
              <div className="flex items-center justify-center gap-3 mb-12">
                <div className="w-12 h-0.5 bg-[#8B4513]"></div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">GALLERY</h2>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {property.gallery.map((galleryImage, index) => {
                  const imageUrl = resolveImage(galleryImage);
                  return (
                    <div
                      key={index}
                      className="relative w-full aspect-[4/3] overflow-hidden bg-gray-200 rounded-lg group cursor-pointer"
                    >
                      <img
                        src={imageUrl || fallbackImage}
                        alt={`${property.title} Gallery ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = fallbackImage;
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* DOWNLOADS Section */}
        {((property.brochures && property.brochures.length > 0) || property.brochure) && (
          <div className="w-full bg-white py-16 px-6 lg:px-16 relative overflow-hidden">
            {/* Decorative Dots Grid - Right */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 hidden lg:block">
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-gray-300 rounded-full"></div>
                ))}
              </div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
              {/* Section Title with Line - Centered */}
              <div className="flex items-center justify-center gap-3 mb-12">
                <div className="w-12 h-0.5 bg-[#8B4513]"></div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">DOWNLOADS</h2>
              </div>

              {/* Brochures */}
              <div className="flex flex-wrap justify-center gap-4">
                {(() => {
                  // Parse brochure_titles if it's a JSON string
                  let brochureTitles = [];
                  if (property.brochure_titles) {
                    if (typeof property.brochure_titles === 'string') {
                      try {
                        brochureTitles = JSON.parse(property.brochure_titles);
                      } catch {
                        brochureTitles = [];
                      }
                    } else if (Array.isArray(property.brochure_titles)) {
                      brochureTitles = property.brochure_titles;
                    }
                  }

                  if (property.brochures && Array.isArray(property.brochures) && property.brochures.length > 0) {
                    // Multiple brochures with titles
                    return property.brochures.map((brochure, index) => {
                      let brochureTitle = 'BROCHURE';
                      let brochureUrl = null;

                      // Handle different brochure data structures
                      if (typeof brochure === 'string') {
                        // If brochure is just a string (file path)
                        brochureUrl = resolveImage(brochure);
                      } else if (brochure && typeof brochure === 'object') {
                        // Handle object structure: { file: "path", title: "Title" } or { path: "path", title: "Title" }
                        const filePath = brochure.file || brochure.path || brochure.file_path;
                        if (filePath) {
                          brochureUrl = resolveImage(filePath);
                        }
                        brochureTitle = brochure.title || brochure.name || brochureTitles[index] || `BROCHURE ${index + 1}`;
                      }

                      // Fallback: Get title from brochure_titles array if not found in object
                      if ((!brochureTitle || brochureTitle === 'BROCHURE') && brochureTitles[index]) {
                        brochureTitle = brochureTitles[index];
                      }

                      // Final fallback
                      if (!brochureTitle || brochureTitle === 'BROCHURE') {
                        brochureTitle = `BROCHURE ${index + 1}`;
                      }

                      if (!brochureUrl) return null;

                      return (
                        <a
                          key={index}
                          href={brochureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-8 py-3 border-2 border-black text-black font-medium uppercase tracking-wide rounded-lg hover:bg-black hover:text-white transition-colors text-sm"
                        >
                          {brochureTitle}
                        </a>
                      );
                    });
                  } else if (property.brochure) {
                    // Single brochure
                    return (
                      <a
                        href={resolveImage(property.brochure)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-8 py-3 border-2 border-black text-black font-medium uppercase tracking-wide rounded-lg hover:bg-black hover:text-white transition-colors text-sm"
                      >
                        BROCHURE
                      </a>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Footer - Light Gray Band */}
        <div className="w-full h-20 bg-gray-100"></div>

        {/* Keywords Display */}
        <KeywordsDisplay />
      </main>
    </>
  );
};

export default CommercialDetail;
