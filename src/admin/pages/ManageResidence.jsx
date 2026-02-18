import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || 'https://seagreen-porcupine-656193.hostingersite.com';
const RESIDENCE_API_ENDPOINT = '/api/admin/residence-properties';

const ManageResidence = () => {
  const navigate = useNavigate();
  const [residences, setResidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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

  const fetchResidences = async () => {
    setLoading(true);
    setError('');
    try {
      // GET /api/admin/residence-properties is public (no credentials needed)
      const res = await fetch(`${API_BASE}${RESIDENCE_API_ENDPOINT}`);
      if (!res.ok) {
        throw new Error('Failed to load residence properties');
      }
      const data = await res.json();
      // Handle different possible response formats
      let residencesArray = [];
      if (Array.isArray(data)) {
        residencesArray = data;
      } else if (data.properties && Array.isArray(data.properties)) {
        residencesArray = data.properties;
      } else if (data.residences && Array.isArray(data.residences)) {
        residencesArray = data.residences;
      } else if (data.residenceProperties && Array.isArray(data.residenceProperties)) {
        residencesArray = data.residenceProperties;
      } else if (data.data && Array.isArray(data.data)) {
        residencesArray = data.data;
      }
      
      console.log('API Response:', data);
      console.log('Parsed residences:', residencesArray);
      
      setResidences(residencesArray);
    } catch (err) {
      console.error('Error fetching residences:', err);
      setError(err.message || 'Failed to load residence properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidences();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}${RESIDENCE_API_ENDPOINT}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to delete residence property');
      }
      setMessage({ type: 'success', text: 'Residence property deleted successfully.' });
      setDeleteConfirm(null);
      fetchResidences();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Delete failed.' });
    }
  };

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
                <h1 className="text-2xl font-semibold text-gray-900">Manage Residence Properties</h1>
                <p className="text-sm text-gray-600 mt-1">
                  View, edit, and delete residence properties
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/admin/add-residence')}
                  className="inline-flex items-center rounded-md bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                >
                  Add New Residence
                </button>
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

            {loading ? (
              <div className="bg-white shadow rounded-lg p-6 text-sm text-gray-600">
                Loading residence properties...
              </div>
            ) : error ? (
              <div className="bg-white shadow rounded-lg p-6 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            ) : !Array.isArray(residences) || residences.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-6 text-sm text-gray-600">
                No residence properties found.
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(Array.isArray(residences) ? residences : []).map((residence) => {
                      const imageUrl = resolveImage(
                        residence.banner_background ||
                        residence.residences_img ||
                        residence.address_img
                      );
                      return (
                        <tr key={residence.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={residence.banner_title || 'Residence'}
                                className="h-16 w-24 object-cover rounded"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="h-16 w-24 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                                No Image
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {residence.banner_title || 'Untitled'}
                            </div>
                            {residence.residences_title && (
                              <div className="text-xs text-gray-500 mt-1">
                                {residence.residences_title}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {residence.banner_location || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-xs text-gray-500">ID: {residence.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => navigate(`/admin/edit-residence/${residence.id}`)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(residence.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
              Are you sure you want to delete this residence property? This action cannot be undone.
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

export default ManageResidence;

