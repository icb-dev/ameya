import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || 'https://seagreen-porcupine-656193.hostingersite.com';

const ChangePopupImage = () => {
  const navigate = useNavigate();
  const [popupImage, setPopupImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [toggling, setToggling] = useState(false);

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
        setError('Unable to verify session.');
      }
    };
    verifyAdmin();
  }, [navigate]);

  const fetchPopupImage = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/admin/popup-image`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to load popup image');
      }
      const data = await res.json();
      console.log('Admin popup image API response:', data);
      console.log('Is array?', Array.isArray(data));
      
      // Handle different response formats
      let images = [];
      
      // Check if response is directly an array
      if (Array.isArray(data)) {
        images = data;
      } else if (data.data?.images) {
        images = data.data.images;
      } else if (data.images) {
        images = data.images;
      } else if (data.data && Array.isArray(data.data)) {
        images = data.data;
      } else if (data.popupImage) {
        // Single image format
        images = [data.popupImage];
      }
      
      console.log('Processed images array:', images);
      
      // Get the active image (should be only one)
      // Check for is_active === 1, is_active === true, or if only one image exists
      const activeImage = images.find((img) => {
        const isActive = img.is_active === 1 || img.is_active === true || img.is_active === '1';
        console.log('Checking image:', img.id, 'is_active:', img.is_active, 'matches:', isActive);
        return isActive;
      }) || images[0] || null;
      
      setPopupImage(activeImage);
      console.log('Active popup image:', activeImage);
    } catch (err) {
      console.error('Error fetching popup image:', err);
      setError(err.message || 'Failed to load popup image');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopupImage();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setMessage({ type: '', text: '' });

    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSubmitting(true);

    if (!imageFile) {
      setMessage({ type: 'error', text: 'Please select an image file.' });
      setSubmitting(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append('image', imageFile);
      // Explicitly set is_active to 1 (active) - send as string '1' for FormData compatibility
      // Some backends might need this as 'true' or parse '1' as integer, but FormData always sends strings
      fd.append('is_active', '1');

      const url = popupImage
        ? `${API_BASE}/api/admin/popup-image/${popupImage.id}`
        : `${API_BASE}/api/admin/popup-image`;

      const method = popupImage ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        credentials: 'include',
        body: fd,
      });

      // Parse response
      const responseData = await res.json().catch(() => ({}));
      console.log('Popup image save response:', responseData);

      if (!res.ok) {
        throw new Error(responseData.message || 'Failed to save popup image');
      }

      // Get the saved image ID (from response or existing popupImage)
      const savedImage = responseData.data || responseData;
      const imageId = savedImage?.id || popupImage?.id;

      if (!imageId) {
        throw new Error('Failed to get image ID from response');
      }

      // ALWAYS ensure the image is set to active after save using the dedicated endpoint
      console.log('Ensuring image is set to active...', { imageId });
      
      try {
        // Use the PATCH /set-active endpoint to ensure the image is active
        const activateRes = await fetch(`${API_BASE}/api/admin/popup-image/${imageId}/set-active`, {
          method: 'PATCH',
          credentials: 'include',
        });
        
        const activateData = await activateRes.json().catch(() => ({}));
        
        if (activateRes.ok) {
          console.log('Successfully ensured image is active:', activateData);
          // Update the popup image state with the response
          if (activateData.popupImage) {
            setPopupImage(activateData.popupImage);
          }
        } else {
          console.error('Failed to activate image:', activateData);
          // Fallback: Try PUT with is_active=1
          try {
            const fallbackFd = new FormData();
            fallbackFd.append('is_active', '1');
            fallbackFd.append('image', imageFile);
            const fallbackRes = await fetch(`${API_BASE}/api/admin/popup-image/${imageId}`, {
              method: 'PUT',
              credentials: 'include',
              body: fallbackFd,
            });
            if (fallbackRes.ok) {
              console.log('Successfully activated using fallback method');
              const fallbackData = await fallbackRes.json().catch(() => ({}));
              if (fallbackData.data) {
                setPopupImage(fallbackData.data);
              }
            }
          } catch (fallbackErr) {
            console.error('Fallback activation also failed:', fallbackErr);
          }
        }
      } catch (activateErr) {
        console.error('Error activating image:', activateErr);
        // Don't throw error, just log it - the image was saved successfully
      }

      setMessage({
        type: 'success',
        text: popupImage ? 'Popup image updated successfully.' : 'Popup image uploaded successfully.',
      });
      setImageFile(null);
      setPreview(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      fetchPopupImage();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save popup image.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async () => {
    if (!popupImage) return;

    const isCurrentlyActive = popupImage.is_active === 1 || popupImage.is_active === true || popupImage.is_active === '1';
    const newStatus = !isCurrentlyActive;

    setToggling(true);
    setMessage({ type: '', text: '' });

    try {
      if (newStatus) {
        // Set as active using the PATCH endpoint
        const res = await fetch(`${API_BASE}/api/admin/popup-image/${popupImage.id}/set-active`, {
          method: 'PATCH',
          credentials: 'include',
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Failed to set image as active');
        }

        const responseData = await res.json();
        setMessage({ type: 'success', text: 'Popup image set as active successfully.' });
        
        // Update the popup image state with the response
        if (responseData.popupImage) {
          setPopupImage(responseData.popupImage);
        } else {
          // Refresh to get updated data
          await fetchPopupImage();
        }
      } else {
        // Set as inactive using PUT with is_active=0
        const fd = new FormData();
        fd.append('is_active', '0');
        // Include the image path to maintain it (some backends require it)
        if (popupImage.image) {
          // We can't send the file again, but we can send the path or just is_active
          // Most backends should accept just is_active for PUT
        }

        const res = await fetch(`${API_BASE}/api/admin/popup-image/${popupImage.id}`, {
          method: 'PUT',
          credentials: 'include',
          body: fd,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Failed to set image as inactive');
        }

        const responseData = await res.json();
        setMessage({ type: 'success', text: 'Popup image set as inactive successfully.' });
        
        // Update the popup image state
        if (responseData.data) {
          setPopupImage(responseData.data);
        } else {
          await fetchPopupImage();
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to toggle status.' });
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!popupImage) return;

    if (!window.confirm('Are you sure you want to delete the popup image? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/popup-image/${popupImage.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to delete popup image');
      }

      setMessage({ type: 'success', text: 'Popup image deleted successfully.' });
      setPopupImage(null);
      setImageFile(null);
      setPreview(null);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Delete failed.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-64 md:flex-shrink-0 md:h-screen md:sticky md:top-0">
          <AdminSidebar />
        </div>
        <main className="flex-1 px-4 py-10 md:px-8 lg:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Change Popup Image</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage the popup contact form image displayed on the homepage
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

            {/* Current Image Display */}
            {loading ? (
              <div className="bg-white shadow rounded-lg p-6 text-sm text-gray-600">
                Loading popup image...
              </div>
            ) : error && !popupImage ? (
              <div className="bg-white shadow rounded-lg p-6 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            ) : !popupImage && !error ? (
              <div className="bg-white shadow rounded-lg p-6 border border-yellow-200 text-sm text-yellow-700">
                No popup image found. Upload an image below to set it as active.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Current Image Section */}
                {popupImage && (
                  <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Popup Image</h2>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="relative aspect-[4/3] bg-gray-100">
                        {popupImage.image ? (
                          <img
                            src={resolveImage(popupImage.image) || ''}
                            alt="Current popup image"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-2">
                          <strong>Image Path:</strong> {popupImage.image}
                        </p>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-gray-600">
                            <strong>Status:</strong>{' '}
                            <span className={
                              (popupImage.is_active === 1 || popupImage.is_active === true || popupImage.is_active === '1') 
                                ? 'text-green-600' 
                                : 'text-gray-500'
                            }>
                              {(popupImage.is_active === 1 || popupImage.is_active === true || popupImage.is_active === '1') 
                                ? 'Active' 
                                : 'Inactive'}
                            </span>
                          </p>
                          {/* Toggle Switch */}
                          <button
                            type="button"
                            onClick={handleToggleActive}
                            disabled={toggling}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                              (popupImage.is_active === 1 || popupImage.is_active === true || popupImage.is_active === '1')
                                ? 'bg-blue-600'
                                : 'bg-gray-300'
                            } ${toggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            aria-label="Toggle active status"
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                (popupImage.is_active === 1 || popupImage.is_active === true || popupImage.is_active === '1')
                                  ? 'translate-x-6'
                                  : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <p className="text-xs text-gray-600">
                          <strong>Last Updated:</strong>{' '}
                          {new Date(popupImage.updated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload/Update Form */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {popupImage ? 'Update Popup Image' : 'Upload Popup Image'}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Popup Image *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="w-full text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended: 800x600px or larger. Supported formats: JPG, PNG, WebP
                      </p>
                    </div>

                    {/* Preview */}
                    {preview && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preview
                        </label>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="relative aspect-[4/3] bg-gray-100">
                            <img
                              src={preview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 flex justify-end space-x-3">
                      {popupImage && (
                        <button
                          type="button"
                          onClick={handleDelete}
                          className="inline-flex items-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Delete Image
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={submitting || !imageFile}
                        className="inline-flex items-center rounded-md bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {submitting
                          ? popupImage
                            ? 'Updating...'
                            : 'Uploading...'
                          : popupImage
                          ? 'Update Image'
                          : 'Upload Image'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Information</h3>
                  <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                    <li>Only one popup image can be active at a time</li>
                    <li>Uploading a new image will automatically set it as active</li>
                    <li>The image appears in the contact popup form on the homepage</li>
                    <li>Recommended image size: 800x600px or larger for best quality</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChangePopupImage;

