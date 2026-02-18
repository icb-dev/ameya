import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || 'https://seagreen-porcupine-656193.hostingersite.com';

const HomeBanner = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    image: null,
    link: '',
    display_order: 0,
    is_active: true,
  });

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

  const fetchBanners = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/admin/homepage-banners`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to load banners');
      }
      const data = await res.json();
      setBanners(data.banners || []);
    } catch (err) {
      setError(err.message || 'Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, image: file }));
  };

  const resetForm = () => {
    setForm({
      image: null,
      link: '',
      display_order: 0,
      is_active: true,
    });
    setEditingBanner(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('link', form.link || '');
      fd.append('display_order', form.display_order || 0);
      fd.append('is_active', form.is_active ? '1' : '0');
      
      if (form.image) {
        fd.append('image', form.image);
      }

      const url = editingBanner
        ? `${API_BASE}/api/admin/homepage-banners/${editingBanner.id}`
        : `${API_BASE}/api/admin/homepage-banners`;
      
      const method = editingBanner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        credentials: 'include',
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to save banner');
      }

      setMessage({
        type: 'success',
        text: editingBanner ? 'Banner updated successfully.' : 'Banner added successfully.',
      });
      resetForm();
      fetchBanners();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save banner.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setForm({
      image: null,
      link: banner.link || '',
      display_order: banner.display_order || 0,
      is_active: banner.is_active !== undefined ? banner.is_active : true,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/homepage-banners/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to delete banner');
      }
      setMessage({ type: 'success', text: 'Banner deleted successfully.' });
      setDeleteConfirm(null);
      fetchBanners();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Delete failed.' });
    }
  };

  const sortedBanners = [...banners].sort((a, b) => {
    if (a.display_order !== b.display_order) {
      return a.display_order - b.display_order;
    }
    return new Date(a.created_at) - new Date(b.created_at);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-64 md:flex-shrink-0 md:h-screen md:sticky md:top-0">
          <AdminSidebar />
        </div>
        <main className="flex-1 px-4 py-10 md:px-8 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Homepage Banners</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage banner images and links for the homepage carousel
                </p>
              </div>
              <div className="flex gap-3">
                {!showAddForm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center rounded-md bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                  >
                    Add Banner
                  </button>
                )}
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="inline-flex items-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  Back to Dashboard
                </button>
              </div>
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

            {showAddForm && (
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Image {editingBanner ? '(leave empty to keep current)' : '*'}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required={!editingBanner}
                      className="w-full text-sm text-gray-700"
                    />
                    {form.image && (
                      <p className="text-xs text-gray-600 mt-1">Selected: {form.image.name}</p>
                    )}
                    {editingBanner && editingBanner.image && !form.image && (
                      <p className="text-xs text-gray-500 mt-1">
                        Current: {editingBanner.image}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link URL (optional)
                    </label>
                    <input
                      type="url"
                      name="link"
                      value={form.link}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        name="display_order"
                        value={form.display_order}
                        onChange={handleChange}
                        min="0"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Lower numbers appear first in the carousel
                      </p>
                    </div>

                    <div className="flex items-center pt-6">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={form.is_active}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-700">
                        Active (show in carousel)
                      </label>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center rounded-md bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 disabled:opacity-60"
                    >
                      {submitting
                        ? editingBanner
                          ? 'Updating...'
                          : 'Uploading...'
                        : editingBanner
                        ? 'Update Banner'
                        : 'Add Banner'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="bg-white shadow rounded-lg p-6 text-sm text-gray-600">
                Loading banners...
              </div>
            ) : error ? (
              <div className="bg-white shadow rounded-lg p-6 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            ) : sortedBanners.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-6 text-sm text-gray-600">
                No banners found. Click "Add Banner" to create one.
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {sortedBanners.map((banner) => (
                    <div
                      key={banner.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-video bg-gray-100">
                        {banner.image ? (
                          <img
                            src={resolveImage(banner.image) || ''}
                            alt={`Banner ${banner.id}`}
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
                        {!banner.is_active && (
                          <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                            Inactive
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="mb-2">
                          <p className="text-xs text-gray-500">Order: {banner.display_order}</p>
                          {banner.link && (
                            <a
                              href={banner.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 break-all"
                            >
                              {banner.link.length > 40
                                ? `${banner.link.substring(0, 40)}...`
                                : banner.link}
                            </a>
                          )}
                          {!banner.link && (
                            <p className="text-xs text-gray-400">No link</p>
                          )}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEdit(banner)}
                            className="flex-1 text-sm text-blue-600 hover:text-blue-900 font-medium py-2 px-3 border border-blue-600 rounded hover:bg-blue-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(banner.id)}
                            className="flex-1 text-sm text-red-600 hover:text-red-900 font-medium py-2 px-3 border border-red-600 rounded hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this banner? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeBanner;

