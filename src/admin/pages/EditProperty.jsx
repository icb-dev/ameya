import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || 'https://seagreen-porcupine-656193.hostingersite.com';

const PREDEFINED_AMENITIES = [
  '80 Lakh Sq. Ft. Integrated Commercial Development',
  'Contemporary & Modern Architectural Façade',
  '1.35 Lakh Sq. Ft. Retail Zone Across Ground & First Floors',
  '35,000 Sq. Ft. Dedicated Medizone on Second Floor',
  'Dedicated Escalators for Second Floor Access',
  'High-Speed Travelators for Smooth Internal Movement',
  'Multiple Passenger & Service Elevators',
  'Ample Surface & Basement Car Parking',
  'Separate Entry & Exit for Hassle-Free Traffic Flow',
  '24×7 Secured CCTV Surveillance',
  'Manned Security with Access Control',
  'Power Backup for Common Areas & Retail Spaces',
  'Centralized Air-Conditioning in Common Areas',
  'Wide Corridors & Spacious Walkways',
  'Fire Fighting System as per International Safety Norms',
  'Smoke Detectors & Sprinkler Systems',
  'Wheelchair-Friendly Access & Ramps',
  'Dedicated Signage & Branding Zones',
  'Landscaped Open Areas & Seating Spaces',
  'High-Speed Internet & Telecom Infrastructure',
  'Professional Facility & Property Management',
  'Energy-Efficient Lighting in Common Areas',
  'Waste Management & Sanitation System',
];

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: 'commercial',
    title: '',
    propertyTitle: '',
    titleDescription: '',
    status: 'ongoing',
    sector: '',
    state: 'gurugram',
    rera_number: '',
  });
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [banner, setBanner] = useState(null);
  const [locationImage, setLocationImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [brochures, setBrochures] = useState([{ file: null, title: '' }]);
  const [mixItems, setMixItems] = useState([{ image: null, text: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Store existing data
  const [existingData, setExistingData] = useState(null);
  
  // Track removed existing items
  const [removedGalleryImages, setRemovedGalleryImages] = useState([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState([]);
  
  // Track which brochures/mix items to keep (by marking them for deletion)
  const [brochuresToDelete, setBrochuresToDelete] = useState([]);
  const [mixItemsToDelete, setMixItemsToDelete] = useState([]);

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

  // Protect page: require admin session
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/profile`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (res.status === 401 || res.status === 403) {
          navigate('/admin/login');
          return;
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Unable to verify session.' });
      }
    };
    verifyAdmin();
  }, [navigate]);

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setMessage({ type: '', text: '' });
      try {
        const res = await fetch(`${API_BASE}/api/admin/properties`, {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Failed to load property');
        }
        const data = await res.json();
        const property = data.properties?.find((p) => p.id === parseInt(id));
        
        if (!property) {
          throw new Error('Property not found');
        }

        setExistingData(property);
        
        // Set existing gallery images
        if (property.gallery && Array.isArray(property.gallery)) {
          setExistingGalleryImages(property.gallery);
        }
        
        // Populate form
        setForm({
          type: property.type || 'commercial',
          title: property.title || '',
          propertyTitle: property.propertyTitle || '',
          titleDescription: property.titleDescription || '',
          status: property.status || 'ongoing',
          sector: property.sector || '',
          state: property.state || 'gurugram',
          rera_number: property.reraNumber || '',
        });

        // Parse amenities
        if (property.amenities) {
          const amenitiesList = property.amenities.split('\n').map(a => a.trim()).filter(Boolean);
          setSelectedAmenities(amenitiesList);
        }

        // Parse brochures
        if (property.brochures && Array.isArray(property.brochures) && property.brochures.length > 0) {
          const parsedBrochures = property.brochures.map(b => ({
            file: null,
            title: b.title || '',
            existingFile: b.file || null,
          }));
          setBrochures(parsedBrochures);
        }

        // Parse mix items
        if (property.mix && Array.isArray(property.mix) && property.mix.length > 0) {
          const parsedMix = property.mix.map(m => ({
            image: null,
            text: m.text || '',
            existingImage: m.image || null,
          }));
          setMixItems(parsedMix);
        }
      } catch (err) {
        setMessage({ type: 'error', text: err.message || 'Failed to load property' });
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (setter) => (e) => {
    const files = e.target.files;
    if (!files) return;
    if (setter === setGallery) {
      setGallery(Array.from(files));
    } else {
      setter(files[0] || null);
    }
  };

  // Amenities checkbox handler
  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities((prev) => {
      if (prev.includes(amenity)) {
        return prev.filter((a) => a !== amenity);
      } else {
        return [...prev, amenity];
      }
    });
  };

  // Brochure handlers
  const handleBrochureTitleChange = (idx, value) => {
    setBrochures((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, title: value } : item))
    );
  };

  const handleBrochureFileChange = (idx, file) => {
    setBrochures((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, file: file } : item))
    );
  };

  const addBrochure = () => setBrochures((prev) => [...prev, { file: null, title: '', existingFile: null }]);
  const removeBrochure = (idx) => {
    const brochure = brochures[idx];
    if (brochure.existingFile) {
      setBrochuresToDelete((prev) => [...prev, brochure.existingFile]);
    }
    setBrochures((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMixTextChange = (idx, value) => {
    setMixItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, text: value } : item))
    );
  };

  const handleMixFileChange = (idx, file) => {
    setMixItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, image: file } : item))
    );
  };

  const addMixItem = () => setMixItems((prev) => [...prev, { image: null, text: '', existingImage: null }]);
  const removeMixItem = (idx) => {
    const mixItem = mixItems[idx];
    if (mixItem.existingImage) {
      setMixItemsToDelete((prev) => [...prev, mixItem.existingImage]);
    }
    setMixItems((prev) => prev.filter((_, i) => i !== idx));
  };

  // Gallery handlers
  const removeExistingGalleryImage = (imageUrl) => {
    setExistingGalleryImages((prev) => prev.filter((img) => img !== imageUrl));
    setRemovedGalleryImages((prev) => [...prev, imageUrl]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('type', form.type);
      fd.append('title', form.title);
      fd.append('propertyTitle', form.propertyTitle);
      fd.append('titleDescription', form.titleDescription);
      fd.append('amenities', selectedAmenities.join('\n'));
      fd.append('status', form.status);
      fd.append('sector', form.sector);
      fd.append('state', form.state);
      fd.append('rera_number', form.rera_number);
      
      // Only append new files if selected
      if (banner) fd.append('banner', banner);
      if (locationImage) fd.append('locationImage', locationImage);
      gallery.forEach((file) => fd.append('gallery', file));
      
      // Send information about removed gallery images
      if (removedGalleryImages.length > 0) {
        fd.append('removedGalleryImages', JSON.stringify(removedGalleryImages));
      }
      
      // Send information about remaining gallery images
      if (existingGalleryImages.length > 0) {
        fd.append('existingGalleryImages', JSON.stringify(existingGalleryImages));
      }
      
      // Add brochures with titles
      const brochureTitles = [];
      brochures.forEach((item) => {
        if (item.file) {
          fd.append('brochures', item.file);
          brochureTitles.push(item.title || '');
        }
      });
      if (brochureTitles.length > 0) {
        fd.append('brochure_titles', JSON.stringify(brochureTitles));
      }
      
      // Send information about removed brochures
      if (brochuresToDelete.length > 0) {
        fd.append('removedBrochures', JSON.stringify(brochuresToDelete));
      }
      
      // Add mix items
      mixItems.forEach((item) => {
        if (item.image) {
          fd.append('theMixImages', item.image);
          fd.append('theMixTexts', item.text || '');
        }
      });
      
      // Send information about removed mix items
      if (mixItemsToDelete.length > 0) {
        fd.append('removedMixItems', JSON.stringify(mixItemsToDelete));
      }

      const res = await fetch(`${API_BASE}/api/admin/properties/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Update failed');
      }

      setMessage({ type: 'success', text: 'Property updated successfully.' });
      setTimeout(() => {
        navigate('/admin/manage-properties');
      }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Update failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-64 md:flex-shrink-0 md:h-screen md:sticky md:top-0">
          <AdminSidebar />
        </div>
        <main className="flex-1 px-4 py-10 md:px-8 lg:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Edit Property</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Update property details, media, and brochure.
                </p>
              </div>
              <button
                onClick={() => navigate('/admin/manage-properties')}
                className="inline-flex items-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Back to Manage
              </button>
            </div>

            {message.text && (
              <div
                className={`mb-6 rounded-md px-4 py-3 text-sm ${
                  message.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {message.text}
              </div>
            )}

            {loading ? (
              <div className="bg-white shadow rounded-lg p-6 text-sm text-gray-600">
                Loading property...
              </div>
            ) : (
            <form
              className="bg-white shadow rounded-lg p-6 space-y-6"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  >
                    <option value="commercial">Commercial</option>
                    {/* <option value="residential">Residential</option> */}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Property title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Title (URL Slug)</label>
                  <input
                    type="text"
                    name="propertyTitle"
                    value={form.propertyTitle}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="property-title-slug (e.g., sapphire-commercial)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Used in URLs. Use lowercase, hyphens instead of spaces.</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title Description</label>
                  <textarea
                    name="titleDescription"
                    value={form.titleDescription}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Short header description"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Amenities</p>
                  <p className="text-xs text-gray-500 mb-4">Select amenities for the property.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto border border-gray-200 rounded-md p-4">
                  {PREDEFINED_AMENITIES.map((amenity, idx) => (
                    <label
                      key={idx}
                      className="flex items-start gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 select-none">{amenity}</span>
                    </label>
                  ))}
                </div>
                {selectedAmenities.length > 0 && (
                  <p className="text-xs text-gray-600">
                    Selected: {selectedAmenities.length} amenity{selectedAmenities.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">The Mix</p>
                    <p className="text-xs text-gray-500">Upload multiple image + text pairs.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addMixItem}
                    className="inline-flex items-center rounded-md bg-blue-700 text-white px-3 py-1 text-xs font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-4">
                  {mixItems.map((item, idx) => (
                    <div key={idx} className="rounded-md border border-gray-200 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-800">Item {idx + 1}</p>
                        {mixItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMixItem(idx)}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            The Mix Image {item.existingImage && <span className="text-xs text-gray-500">(current file uploaded)</span>}
                          </label>
                          {item.existingImage && !item.image && (
                            <div className="mb-2">
                              <img 
                                src={resolveImage(item.existingImage)} 
                                alt={`Mix ${idx + 1}`}
                                className="w-full h-24 object-cover rounded border border-gray-300"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <p className="text-xs text-gray-500 mt-1">Current image</p>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleMixFileChange(idx, e.target.files?.[0] || null)}
                            className="w-full text-sm text-gray-700"
                          />
                          {item.image && (
                            <p className="text-xs text-gray-600 mt-1">New: {item.image.name}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            The Mix Text
                          </label>
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => handleMixTextChange(idx, e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                            placeholder="Short description for this mix image"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                  <input
                    type="text"
                    name="sector"
                    value={form.sector}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="e.g., Sector - 82A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="gurugram"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">RERA Number</label>
                  <input
                    type="text"
                    name="rera_number"
                    value={form.rera_number}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="e.g., 01 OF 2022 DATED 19.01.2022"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Image {existingData?.banner && <span className="text-xs text-gray-500">(current file uploaded)</span>}
                  </label>
                  {existingData?.banner && !banner && (
                    <div className="mb-3">
                      <img 
                        src={resolveImage(existingData.banner)} 
                        alt="Current banner"
                        className="w-full h-32 object-cover rounded border border-gray-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">Current banner image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange(setBanner)}
                    className="w-full text-sm text-gray-700"
                  />
                  {banner && (
                    <p className="text-xs text-gray-600 mt-1">New: {banner.name}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Image {existingData?.locationImage && <span className="text-xs text-gray-500">(current file uploaded)</span>}
                  </label>
                  {existingData?.locationImage && !locationImage && (
                    <div className="mb-3">
                      <img 
                        src={resolveImage(existingData.locationImage)} 
                        alt="Current location"
                        className="w-full h-32 object-cover rounded border border-gray-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">Current location image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange(setLocationImage)}
                    className="w-full text-sm text-gray-700"
                  />
                  {locationImage && (
                    <p className="text-xs text-gray-600 mt-1">New: {locationImage.name}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gallery Images {existingGalleryImages.length > 0 && <span className="text-xs text-gray-500">({existingGalleryImages.length} current files)</span>}
                  </label>
                  
                  {/* Existing Gallery Images */}
                  {existingGalleryImages.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 mb-2">Current Images (click × to remove):</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {existingGalleryImages.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img 
                              src={resolveImage(img)} 
                              alt={`Gallery ${idx + 1}`}
                              className="w-full h-24 object-cover rounded border border-gray-300"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingGalleryImage(img)}
                              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove this image"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Upload New Gallery Images */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Add New Gallery Images:</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange(setGallery)}
                      className="w-full text-sm text-gray-700"
                    />
                    {gallery.length > 0 && (
                      <p className="text-xs text-gray-600 mt-1">
                        New: {gallery.length} file{gallery.length > 1 ? 's' : ''} will be added
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Brochures (PDF)</p>
                    <p className="text-xs text-gray-500">Upload multiple brochures with titles.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addBrochure}
                    className="inline-flex items-center rounded-md bg-blue-700 text-white px-3 py-1 text-xs font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                  >
                    Add Brochure
                  </button>
                </div>

                <div className="space-y-4">
                  {brochures.map((item, idx) => (
                    <div key={idx} className="rounded-md border border-gray-200 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-800">Brochure {idx + 1}</p>
                        {brochures.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeBrochure(idx)}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Brochure PDF {item.existingFile && <span className="text-xs text-gray-500">(current file uploaded)</span>}
                          </label>
                          {item.existingFile && !item.file && (
                            <div className="mb-2">
                              <a 
                                href={resolveImage(item.existingFile)} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 underline"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                View current brochure
                              </a>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => handleBrochureFileChange(idx, e.target.files?.[0] || null)}
                            className="w-full text-sm text-gray-700"
                          />
                          {item.file && (
                            <p className="text-xs text-gray-600 mt-1">New: {item.file.name}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Brochure Title
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleBrochureTitleChange(idx, e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                            placeholder="e.g., Floor Plan, Price List, etc."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/manage-properties')}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center rounded-md bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 disabled:opacity-60"
                >
                  {submitting ? 'Updating...' : 'Update Property'}
                </button>
              </div>
            </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditProperty;

