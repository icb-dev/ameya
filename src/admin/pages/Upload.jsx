import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const Upload = () => {
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
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  

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
        // If other errors, show message but stay
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setMessage({ type: 'error', text: data.message || 'Unable to verify session.' });
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Unable to reach server to verify session.' });
      } finally {
        setCheckingAuth(false);
      }
    };
    verifyAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm({
      type: 'commercial',
      title: '',
      propertyTitle: '',
      titleDescription: '',
      status: 'ongoing',
      sector: '',
      state: 'gurugram',
      rera_number: '',
    });
    setSelectedAmenities([]);
    setBanner(null);
    setLocationImage(null);
    setGallery([]);
    setBrochures([{ file: null, title: '' }]);
    setMixItems([{ image: null, text: '' }]);
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

  const addBrochure = () => setBrochures((prev) => [...prev, { file: null, title: '' }]);
  const removeBrochure = (idx) => setBrochures((prev) => prev.filter((_, i) => i !== idx));

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

  const addMixItem = () => setMixItems((prev) => [...prev, { image: null, text: '' }]);
  const removeMixItem = (idx) => setMixItems((prev) => prev.filter((_, i) => i !== idx));

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
      // Join selected amenities with newlines
      fd.append('amenities', selectedAmenities.join('\n'));
      fd.append('status', form.status);
      fd.append('sector', form.sector);
      fd.append('state', form.state);
      fd.append('rera_number', form.rera_number);
      if (banner) fd.append('banner', banner);
      if (locationImage) fd.append('locationImage', locationImage);
      gallery.forEach((file) => fd.append('gallery', file));
      
      // Add brochures with titles
      const brochureTitles = [];
      brochures.forEach((item) => {
        if (item.file) {
          fd.append('brochures', item.file);
          brochureTitles.push(item.title || '');
        }
      });
      // Send titles as JSON string
      if (brochureTitles.length > 0) {
        fd.append('brochure_titles', JSON.stringify(brochureTitles));
      }
      
      // Add mix items (must be aligned: only add text when there's an image)
      mixItems.forEach((item) => {
        if (item.image) {
          fd.append('theMixImages', item.image);
          fd.append('theMixTexts', item.text || '');
        }
      });

      const res = await fetch(`${API_BASE}/api/admin/properties`, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Upload failed');
      }

      setMessage({ type: 'success', text: 'Property uploaded successfully.' });
      resetForm();
      // navigate('/admin/dashboard'); // optional redirect
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Upload failed.' });
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
                <h1 className="text-2xl font-semibold text-gray-900">Upload Property</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Add new property details, media, and brochure.
                </p>
              </div>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="inline-flex items-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Back to Dashboard
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

            {checkingAuth ? (
              <div className="bg-white shadow rounded-lg p-6 text-sm text-gray-600">
                Verifying session...
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
                  <input
                    type="text"
                    name="titleDescription"
                    value={form.titleDescription}
                    onChange={handleChange}
                    required
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
                            The Mix Image
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleMixFileChange(idx, e.target.files?.[0] || null)}
                            className="w-full text-sm text-gray-700"
                          />
                          {item.image && (
                            <p className="text-xs text-gray-600 mt-1">Selected: {item.image.name}</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange(setBanner)}
                    className="w-full text-sm text-gray-700"
                  />
                  {banner && (
                    <p className="text-xs text-gray-600 mt-1">Selected: {banner.name}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange(setLocationImage)}
                    className="w-full text-sm text-gray-700"
                  />
                  {locationImage && (
                    <p className="text-xs text-gray-600 mt-1">Selected: {locationImage.name}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images (Multiple)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange(setGallery)}
                    className="w-full text-sm text-gray-700"
                  />
                  {gallery.length > 0 && (
                    <p className="text-xs text-gray-600 mt-1">
                      Selected: {gallery.length} file{gallery.length > 1 ? 's' : ''}
                    </p>
                  )}
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
                            Brochure PDF
                          </label>
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => handleBrochureFileChange(idx, e.target.files?.[0] || null)}
                            className="w-full text-sm text-gray-700"
                          />
                          {item.file && (
                            <p className="text-xs text-gray-600 mt-1">Selected: {item.file.name}</p>
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
                  onClick={resetForm}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center rounded-md bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 disabled:opacity-60"
                >
                  {submitting ? 'Uploading...' : 'Upload Property'}
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

export default Upload;
