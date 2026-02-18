import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || 'https://seagreen-porcupine-656193.hostingersite.com';
const RESIDENCE_API_ENDPOINT = '/api/admin/residence-properties';

const EditResidence = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    banner_background: null,
    banner_title: '',
    banner_location: '',
    address_title: '',
    address_img: null,
    address_features: [{ text: '' }],
    basic_amenities_text: '',
    basic_amenities_img: null,
    club_title: '',
    club_description: '',
    club_features: [{ text: '' }],
    club_img: null,
    cafe_title: '',
    cafe_img: null,
    feature_img1: null,
    feature_text1: '',
    feature_img2: null,
    feature_text2: '',
    greenhub_bg_img: null,
    greenhub_title: '',
    greenhub_description: '',
    residences_title: '',
    residences_description: '',
    residences_img: null,
    residences_features: [{ text: '' }],
    living_room_bg_img: null,
    living_room_title: '',
    living_room_description: '',
    plans: [{ name: '', img: null }],
    location_title: '',
    location_description: '',
    location_img: null,
    near_by_title: '',
    nearby_time: [{ text: '' }],
    nearby_location: [{ text: '' }],
    nearby: [{ text: '' }],
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [existingData, setExistingData] = useState(null);

  // Debug: Log form changes
  useEffect(() => {
    if (form.banner_title || form.address_title) {
      console.log('Form state updated:', {
        banner_title: form.banner_title,
        address_title: form.address_title,
        residences_title: form.residences_title,
      });
    }
  }, [form.banner_title, form.address_title, form.residences_title]);

  // Resolve image URL
  const resolveImage = (path) => {
    if (!path) return null;
    const trimmed = String(path).trim();

    if (/^https?:\/\//i.test(trimmed)) {
      try {
        const u = new URL(trimmed);
        const p = u.pathname;
        const idx = p.lastIndexOf('/uploads/');
        if (idx !== -1) {
          return `${API_BASE}${p.substring(idx)}`;
        }
        return trimmed;
      } catch {
        // fall through
      }
    }

    if (trimmed.startsWith('/uploads')) {
      return `${API_BASE}${trimmed}`;
    }

    const idxFs = trimmed.lastIndexOf('/uploads/');
    if (idxFs !== -1) {
      return `${API_BASE}${trimmed.substring(idxFs)}`;
    }

    return `${API_BASE}/uploads/${trimmed.replace(/^uploads[\\/]/, '')}`;
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
  }, [navigate]);

  // Fetch existing residence data
  useEffect(() => {
    const fetchResidence = async () => {
      if (!id) return;
      setLoading(true);
      setMessage({ type: '', text: '' });
      try {
        // GET /api/admin/residence-properties/:id is public (no credentials needed)
        const res = await fetch(`${API_BASE}${RESIDENCE_API_ENDPOINT}/${id}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Failed to load residence property');
        }
        const data = await res.json();
        console.log('Edit Residence - Full API Response:', JSON.stringify(data, null, 2));
        
        // Handle different possible response formats
        let residence = null;
        if (data.residence) {
          residence = data.residence;
        } else if (data.residenceProperty) {
          residence = data.residenceProperty;
        } else if (data.property) {
          residence = data.property;
        } else if (data.data) {
          residence = data.data;
        } else if (data && typeof data === 'object' && !Array.isArray(data) && data.id) {
          // Direct object with id field
          residence = data;
        }
        
        console.log('Edit Residence - Parsed residence:', residence);
        console.log('Edit Residence - Residence keys:', residence ? Object.keys(residence) : 'null');
        
        if (!residence || (typeof residence === 'object' && Object.keys(residence).length === 0)) {
          console.error('Residence not found in response:', data);
          throw new Error('Residence property not found or empty');
        }
        
        setExistingData(residence);

        // Parse JSON strings if needed
        const parseJsonField = (field) => {
          if (!field) return [];
          if (Array.isArray(field)) return field;
          if (typeof field === 'string') {
            try {
              return JSON.parse(field);
            } catch {
              return field.split(',').map((item) => item.trim()).filter(Boolean);
            }
          }
          return [];
        };

        // Populate form with existing data
        const addressFeaturesParsed = parseJsonField(residence.address_features);
        const clubFeaturesParsed = parseJsonField(residence.club_features);
        const residencesFeaturesParsed = parseJsonField(residence.residences_features);
        const nearbyTimeParsed = parseJsonField(residence.nearby_time);
        const nearbyLocationParsed = parseJsonField(residence.nearby_location);
        const nearbyParsed = parseJsonField(residence.nearby);
        const plansParsed = residence.plans || [];

        setForm({
          banner_background: null,
          banner_title: residence.banner_title || '',
          banner_location: residence.banner_location || '',
          address_title: residence.address_title || '',
          address_img: null,
          address_features: addressFeaturesParsed.length > 0 
            ? addressFeaturesParsed.map((text) => ({ text: String(text) }))
            : [{ text: '' }],
          basic_amenities_text: residence.basic_amenities_text || '',
          basic_amenities_img: null,
          club_title: residence.club_title || '',
          club_description: residence.club_description || '',
          club_features: clubFeaturesParsed.length > 0
            ? clubFeaturesParsed.map((text) => ({ text: String(text) }))
            : [{ text: '' }],
          club_img: null,
          cafe_title: residence.cafe_title || '',
          cafe_img: null,
          feature_img1: null,
          feature_text1: residence.feature_text1 || '',
          feature_img2: null,
          feature_text2: residence.feature_text2 || '',
          greenhub_bg_img: null,
          greenhub_title: residence.greenhub_title || '',
          greenhub_description: residence.greenhub_description || '',
          residences_title: residence.residences_title || '',
          residences_description: residence.residences_description || '',
          residences_img: null,
          residences_features: residencesFeaturesParsed.length > 0
            ? residencesFeaturesParsed.map((text) => ({ text: String(text) }))
            : [{ text: '' }],
          living_room_bg_img: null,
          living_room_title: residence.living_room_title || '',
          living_room_description: residence.living_room_description || '',
          plans: plansParsed.length > 0
            ? plansParsed.map((plan) => ({
                name: plan.name || '',
                img: null,
                existingImage: plan.image || plan.img || null,
              }))
            : [{ name: '', img: null, existingImage: null }],
          location_title: residence.location_title || '',
          location_description: residence.location_description || '',
          location_img: null,
          near_by_title: residence.near_by_title || '',
          nearby_time: nearbyTimeParsed.length > 0
            ? nearbyTimeParsed.map((text) => ({ text: String(text) }))
            : [{ text: '' }],
          nearby_location: nearbyLocationParsed.length > 0
            ? nearbyLocationParsed.map((text) => ({ text: String(text) }))
            : [{ text: '' }],
          nearby: nearbyParsed.length > 0
            ? nearbyParsed.map((text) => ({ text: String(text) }))
            : [{ text: '' }],
        });
        
        console.log('Edit Residence - Form populated with:', {
          banner_title: residence.banner_title,
          banner_location: residence.banner_location,
          address_title: residence.address_title,
          residences_title: residence.residences_title,
        });
      } catch (err) {
        console.error('Edit Residence - Error loading:', err);
        setMessage({ type: 'error', text: err.message || 'Failed to load residence property' });
      } finally {
        setLoading(false);
      }
    };

    if (!checkingAuth) {
      fetchResidence();
    }
  }, [id, checkingAuth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (fieldName) => (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, [fieldName]: file }));
  };

  // Array field handlers
  const handleArrayFieldChange = (fieldName, idx, value) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item, i) => (i === idx ? { ...item, text: value } : item)),
    }));
  };

  const addArrayField = (fieldName) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: [...prev[fieldName], { text: '' }],
    }));
  };

  const removeArrayField = (fieldName, idx) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== idx),
    }));
  };

  // Plan handlers (name + image)
  const handlePlanNameChange = (idx, value) => {
    setForm((prev) => ({
      ...prev,
      plans: prev.plans.map((item, i) => (i === idx ? { ...item, name: value } : item)),
    }));
  };

  const handlePlanFileChange = (idx, file) => {
    setForm((prev) => ({
      ...prev,
      plans: prev.plans.map((item, i) => (i === idx ? { ...item, img: file, existingImage: null } : item)),
    }));
  };

  const addPlan = () => {
    setForm((prev) => ({
      ...prev,
      plans: [...prev.plans, { name: '', img: null, existingImage: null }],
    }));
  };

  const removePlan = (idx) => {
    setForm((prev) => ({
      ...prev,
      plans: prev.plans.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSubmitting(true);

    try {
      const fd = new FormData();

      // Single text fields
      fd.append('banner_title', form.banner_title);
      fd.append('banner_location', form.banner_location);
      fd.append('address_title', form.address_title);
      fd.append('basic_amenities_text', form.basic_amenities_text);
      fd.append('club_title', form.club_title);
      fd.append('club_description', form.club_description);
      fd.append('cafe_title', form.cafe_title);
      fd.append('feature_text1', form.feature_text1);
      fd.append('feature_text2', form.feature_text2);
      fd.append('greenhub_title', form.greenhub_title);
      fd.append('greenhub_description', form.greenhub_description);
      fd.append('residences_title', form.residences_title);
      fd.append('residences_description', form.residences_description);
      fd.append('living_room_title', form.living_room_title);
      fd.append('living_room_description', form.living_room_description);
      fd.append('location_title', form.location_title);
      fd.append('location_description', form.location_description);
      fd.append('near_by_title', form.near_by_title);

      // Single image fields - only append if new file selected
      if (form.banner_background) fd.append('banner_background', form.banner_background);
      if (form.address_img) fd.append('address_img', form.address_img);
      if (form.basic_amenities_img) fd.append('basic_amenities_img', form.basic_amenities_img);
      if (form.club_img) fd.append('club_img', form.club_img);
      if (form.cafe_img) fd.append('cafe_img', form.cafe_img);
      if (form.feature_img1) fd.append('feature_img1', form.feature_img1);
      if (form.feature_img2) fd.append('feature_img2', form.feature_img2);
      if (form.greenhub_bg_img) fd.append('greenhub_bg_img', form.greenhub_bg_img);
      if (form.residences_img) fd.append('residences_img', form.residences_img);
      if (form.living_room_bg_img) fd.append('living_room_bg_img', form.living_room_bg_img);
      if (form.location_img) fd.append('location_img', form.location_img);

      // Plans array (name + image)
      const planNames = [];
      (form.plans || []).forEach((item) => {
        if (item.img) {
          fd.append('plan_images', item.img);
          planNames.push(item.name || '');
        } else if (item.existingImage && item.name) {
          // Keep existing plan
          planNames.push(item.name || '');
        }
      });
      if (planNames.length > 0) {
        fd.append('plan_names', JSON.stringify(planNames));
      }

      // Array fields
      const addressFeatures = form.address_features.map((item) => item.text).filter((text) => text.trim());
      if (addressFeatures.length > 0) {
        fd.append('address_features', JSON.stringify(addressFeatures));
      }

      const clubFeatures = form.club_features.map((item) => item.text).filter((text) => text.trim());
      if (clubFeatures.length > 0) {
        fd.append('club_features', JSON.stringify(clubFeatures));
      }

      const residencesFeatures = form.residences_features.map((item) => item.text).filter((text) => text.trim());
      if (residencesFeatures.length > 0) {
        fd.append('residences_features', JSON.stringify(residencesFeatures));
      }

      const nearbyTime = form.nearby_time.map((item) => item.text).filter((text) => text.trim());
      if (nearbyTime.length > 0) {
        fd.append('nearby_time', JSON.stringify(nearbyTime));
      }

      const nearbyLocation = form.nearby_location.map((item) => item.text).filter((text) => text.trim());
      if (nearbyLocation.length > 0) {
        fd.append('nearby_location', JSON.stringify(nearbyLocation));
      }

      const nearby = form.nearby.map((item) => item.text).filter((text) => text.trim());
      if (nearby.length > 0) {
        fd.append('nearby', JSON.stringify(nearby));
      }

      const res = await fetch(`${API_BASE}${RESIDENCE_API_ENDPOINT}/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Update failed');
      }

      setMessage({ type: 'success', text: 'Residence property updated successfully.' });
      setTimeout(() => {
        navigate('/admin/manage-residence');
      }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Update failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const renderArrayField = (fieldName, label, placeholder = 'Enter text') => {
    const fieldArray = form[fieldName] || [];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">{label}</p>
            <p className="text-xs text-gray-500">Add multiple items using the Add button.</p>
          </div>
          <button
            type="button"
            onClick={() => addArrayField(fieldName)}
            className="inline-flex items-center rounded-md bg-blue-700 text-white px-3 py-1 text-xs font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {fieldArray.map((item, idx) => (
            <div key={idx} className="rounded-md border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-800">Item {idx + 1}</p>
                {fieldArray.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField(fieldName, idx)}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                )}
              </div>
              <input
                type="text"
                value={item.text}
                onChange={(e) => handleArrayFieldChange(fieldName, idx, e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderImageField = (fieldName, label, existingImagePath) => {
    const existingImage = existingImagePath ? resolveImage(existingImagePath) : null;
    const newFile = form[fieldName];

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        {existingImage && !newFile && (
          <div className="mb-2">
            <img
              src={existingImage}
              alt="Current"
              className="h-24 w-32 object-cover rounded border border-gray-300"
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
          onChange={handleFileChange(fieldName)}
          className="w-full text-sm text-gray-700"
        />
        {newFile && (
          <p className="text-xs text-gray-600 mt-1">New file selected: {newFile.name}</p>
        )}
      </div>
    );
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
                <h1 className="text-2xl font-semibold text-gray-900">Edit Residence Property</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Update residence property details, images, and features.
                </p>
              </div>
              <button
                onClick={() => navigate('/admin/manage-residence')}
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

            {checkingAuth || loading ? (
              <div className="bg-white shadow rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600">
                  {checkingAuth ? 'Verifying session...' : 'Loading residence property...'}
                </p>
              </div>
            ) : message.type === 'error' && !existingData ? (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-center">
                  <p className="text-sm text-red-700 mb-4">
                    {message.text || 'Failed to load residence property'}
                  </p>
                  <button
                    onClick={() => navigate('/admin/manage-residence')}
                    className="inline-flex items-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black"
                  >
                    Back to Manage Residence
                  </button>
                </div>
              </div>
            ) : (
              <form
                className="bg-white shadow rounded-lg p-6 space-y-8"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                {/* Banner Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Banner Section</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderImageField('banner_background', 'Banner Background Image', existingData?.banner_background)}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Banner Title</label>
                      <input
                        type="text"
                        name="banner_title"
                        value={form.banner_title}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter banner title"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Banner Location</label>
                      <input
                        type="text"
                        name="banner_location"
                        value={form.banner_location}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter banner location"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Section</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address Title</label>
                      <input
                        type="text"
                        name="address_title"
                        value={form.address_title}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter address title"
                      />
                    </div>
                    {renderImageField('address_img', 'Address Image', existingData?.address_img)}
                  </div>
                  <div className="mt-4">
                    {renderArrayField('address_features', 'Address Features', 'Enter address feature')}
                  </div>
                </div>

                {/* Basic Amenities Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Amenities Section</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Basic Amenities Text</label>
                      <textarea
                        name="basic_amenities_text"
                        value={form.basic_amenities_text}
                        onChange={handleChange}
                        rows="4"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter basic amenities text"
                      />
                    </div>
                    {renderImageField('basic_amenities_img', 'Basic Amenities Image', existingData?.basic_amenities_img)}
                  </div>
                </div>

                {/* Club Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Club Section</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Club Title</label>
                      <input
                        type="text"
                        name="club_title"
                        value={form.club_title}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter club title"
                      />
                    </div>
                    {renderImageField('club_img', 'Club Image', existingData?.club_img)}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Club Description</label>
                      <textarea
                        name="club_description"
                        value={form.club_description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter club description"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    {renderArrayField('club_features', 'Club Features', 'Enter club feature')}
                  </div>
                </div>

                {/* Cafe Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Cafe Section</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cafe Title</label>
                      <input
                        type="text"
                        name="cafe_title"
                        value={form.cafe_title}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter cafe title"
                      />
                    </div>
                    {renderImageField('cafe_img', 'Cafe Image', existingData?.cafe_img)}
                  </div>
                </div>

                {/* Feature Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Feature Section</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderImageField('feature_img1', 'Feature Image 1', existingData?.feature_img1)}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Feature Text 1</label>
                      <input
                        type="text"
                        name="feature_text1"
                        value={form.feature_text1}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter feature text 1"
                      />
                    </div>
                    {renderImageField('feature_img2', 'Feature Image 2', existingData?.feature_img2)}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Feature Text 2</label>
                      <input
                        type="text"
                        name="feature_text2"
                        value={form.feature_text2}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter feature text 2"
                      />
                    </div>
                  </div>
                </div>

                {/* Greenhub Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Greenhub Section</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderImageField('greenhub_bg_img', 'Greenhub Background Image', existingData?.greenhub_bg_img)}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Greenhub Title</label>
                      <input
                        type="text"
                        name="greenhub_title"
                        value={form.greenhub_title}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter greenhub title"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Greenhub Description</label>
                      <textarea
                        name="greenhub_description"
                        value={form.greenhub_description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter greenhub description"
                      />
                    </div>
                  </div>
                </div>

                {/* Residences Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Residences Section</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Residences Title</label>
                      <input
                        type="text"
                        name="residences_title"
                        value={form.residences_title}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter residences title"
                      />
                    </div>
                    {renderImageField('residences_img', 'Residences Image', existingData?.residences_img)}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Residences Description</label>
                      <textarea
                        name="residences_description"
                        value={form.residences_description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter residences description"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    {renderArrayField('residences_features', 'Residences Features', 'Enter residence feature')}
                  </div>
                </div>

                {/* Living Room Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Living Room Section</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderImageField('living_room_bg_img', 'Living Room Background Image', existingData?.living_room_bg_img)}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Living Room Title</label>
                      <input
                        type="text"
                        name="living_room_title"
                        value={form.living_room_title}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter living room title"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Living Room Description</label>
                      <textarea
                        name="living_room_description"
                        value={form.living_room_description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter living room description"
                      />
                    </div>
                  </div>
                </div>

                {/* Plan Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Plan Section</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Plans</p>
                        <p className="text-xs text-gray-500">Add multiple plans with names and images.</p>
                      </div>
                      <button
                        type="button"
                        onClick={addPlan}
                        className="inline-flex items-center rounded-md bg-blue-700 text-white px-3 py-1 text-xs font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                      >
                        Add Plan
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(form.plans || []).map((item, idx) => (
                        <div key={idx} className="rounded-md border border-gray-200 p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-800">Plan {idx + 1}</p>
                            {(form.plans || []).length > 1 && (
                              <button
                                type="button"
                                onClick={() => removePlan(idx)}
                                className="text-xs text-red-600 hover:text-red-700 font-medium"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Plan Name
                              </label>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handlePlanNameChange(idx, e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                placeholder="Enter plan name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Plan Image
                              </label>
                              {item.existingImage && !item.img && (
                                <div className="mb-2">
                                  <img
                                    src={resolveImage(item.existingImage)}
                                    alt="Current plan"
                                    className="h-24 w-32 object-cover rounded border border-gray-300"
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
                                onChange={(e) => handlePlanFileChange(idx, e.target.files?.[0] || null)}
                                className="w-full text-sm text-gray-700"
                              />
                              {item.img && (
                                <p className="text-xs text-gray-600 mt-1">New file selected: {item.img.name}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Section</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location Title</label>
                      <input
                        type="text"
                        name="location_title"
                        value={form.location_title}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter location title"
                      />
                    </div>
                    {renderImageField('location_img', 'Location Image', existingData?.location_img)}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location Description</label>
                      <textarea
                        name="location_description"
                        value={form.location_description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Enter location description"
                      />
                    </div>
                  </div>
                </div>

                {/* Nearby Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Nearby Section</h2>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Near By Title</label>
                    <input
                      type="text"
                      name="near_by_title"
                      value={form.near_by_title}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      placeholder="Enter near by title"
                    />
                  </div>
                  <div className="space-y-6">
                    {renderArrayField('nearby_time', 'Nearby Time', 'Enter time (e.g., 5 mins)')}
                    {renderArrayField('nearby_location', 'Nearby Location', 'Enter location name')}
                    {renderArrayField('nearby', 'Nearby', 'Enter nearby item')}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/manage-residence')}
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

export default EditResidence;

