import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || 'https://seagreen-porcupine-656193.hostingersite.com';
const KEYWORDS_API_ENDPOINT = '/api/admin/keywords';

const AddKeywords = () => {
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    keyword: '',
    redirect_url: '',
  });
  const [keywordItems, setKeywordItems] = useState([{ keyword: '', redirect_url: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [toggling, setToggling] = useState(null);

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

  // Fetch keywords list
  const fetchKeywords = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}${KEYWORDS_API_ENDPOINT}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to load keywords');
      }
      const data = await res.json();
      const keywordsArray = Array.isArray(data) ? data : (data.keywords || data.data || []);
      setKeywords(keywordsArray);
    } catch (err) {
      console.error('Error fetching keywords:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to load keywords' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!checkingAuth) {
      fetchKeywords();
    }
  }, [checkingAuth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMessage({ type: '', text: '' });
  };

  const handleKeywordItemChange = (index, field, value) => {
    setKeywordItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addKeywordItem = () => {
    setKeywordItems((prev) => [...prev, { keyword: '', redirect_url: '' }]);
  };

  const removeKeywordItem = (index) => {
    if (keywordItems.length > 1) {
      setKeywordItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const resetForm = () => {
    setForm({ keyword: '', redirect_url: '' });
    setKeywordItems([{ keyword: '', redirect_url: '' }]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validate form
    if (editingId) {
      // Single keyword edit - keyword is required, redirect_url is optional
      if (!form.keyword.trim()) {
        setMessage({ type: 'error', text: 'Please enter a keyword.' });
        return;
      }
    } else {
      // Multiple keywords add - keyword is required, redirect_url is optional
      const validItems = keywordItems.filter((item) => item.keyword.trim());
      if (validItems.length === 0) {
        setMessage({ type: 'error', text: 'Please add at least one keyword.' });
        return;
      }
    }

    // Validate URLs only if provided
    const itemsToValidate = editingId ? [form] : keywordItems;
    for (const item of itemsToValidate) {
      if (item.keyword.trim() && item.redirect_url && item.redirect_url.trim()) {
        try {
          new URL(item.redirect_url);
        } catch {
          // If not a full URL, check if it's a relative path
          if (!item.redirect_url.startsWith('/') && !item.redirect_url.startsWith('#')) {
            setMessage({
              type: 'error',
              text: `Invalid URL format for "${item.keyword}". Please use a full URL (http://...) or a relative path (/path).`,
            });
            return;
          }
        }
      }
    }

    setSubmitting(true);

    try {
      if (editingId) {
        // Update single keyword
        const res = await fetch(`${API_BASE}${KEYWORDS_API_ENDPOINT}/${editingId}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            keyword: form.keyword.trim(),
            redirect_url: form.redirect_url ? form.redirect_url.trim() : null,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Failed to update keyword');
        }

        setMessage({ type: 'success', text: 'Keyword updated successfully!' });
        resetForm();
        fetchKeywords();
      } else {
        // Add multiple keywords
        const validItems = keywordItems.filter(
          (item) => item.keyword.trim() && item.redirect_url.trim()
        );

        const res = await fetch(`${API_BASE}${KEYWORDS_API_ENDPOINT}`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            keywords: validItems.map((item) => ({
              keyword: item.keyword.trim(),
              redirect_url: item.redirect_url ? item.redirect_url.trim() : null,
            })),
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Failed to add keywords');
        }

        setMessage({ type: 'success', text: `${validItems.length} keyword(s) added successfully!` });
        resetForm();
        fetchKeywords();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save keywords.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (keyword) => {
    setForm({
      keyword: keyword.keyword || '',
      redirect_url: keyword.redirect_url || '',
    });
    setEditingId(keyword.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this keyword?')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}${KEYWORDS_API_ENDPOINT}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to delete keyword');
      }

      setMessage({ type: 'success', text: 'Keyword deleted successfully!' });
      fetchKeywords();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete keyword' });
    }
  };

  const handleToggle = async (id, currentStatus) => {
    setToggling(id);
    try {
      const res = await fetch(`${API_BASE}${KEYWORDS_API_ENDPOINT}/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to toggle keyword status');
      }

      setMessage({
        type: 'success',
        text: `Keyword ${currentStatus ? 'deactivated' : 'activated'} successfully!`,
      });
      fetchKeywords();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to toggle keyword status' });
    } finally {
      setToggling(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedKeywords.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one keyword to delete.' });
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedKeywords.length} keyword(s)?`)) {
      return;
    }

    setBulkDeleting(true);
    try {
      const res = await fetch(`${API_BASE}${KEYWORDS_API_ENDPOINT}/bulk`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedKeywords }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to delete keywords');
      }

      setMessage({
        type: 'success',
        text: `${selectedKeywords.length} keyword(s) deleted successfully!`,
      });
      setSelectedKeywords([]);
      fetchKeywords();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete keywords' });
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleSelectKeyword = (id) => {
    setSelectedKeywords((prev) =>
      prev.includes(id) ? prev.filter((kId) => kId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedKeywords.length === keywords.length) {
      setSelectedKeywords([]);
    } else {
      setSelectedKeywords(keywords.map((k) => k.id));
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Verifying session...</p>
      </div>
    );
  }

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
                <h1 className="text-2xl font-semibold text-gray-900">Keywords Management</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Add and manage keywords with redirection links
                </p>
              </div>
              {!showForm && (
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="inline-flex items-center rounded-md bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                >
                  + Add Keywords
                </button>
              )}
              {showForm && (
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="inline-flex items-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  Back to List
                </button>
              )}
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

            {showForm ? (
              <form
                className="bg-white shadow rounded-lg p-6 space-y-6"
                onSubmit={handleSubmit}
              >
                {editingId ? (
                  // Edit single keyword
                  <>
                    <div className="border-b border-gray-200 pb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Edit Keyword</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Keyword <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="keyword"
                          value={form.keyword}
                          onChange={handleChange}
                          required
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                          placeholder="Enter keyword"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Redirect URL <span className="text-xs text-gray-500">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          name="redirect_url"
                          value={form.redirect_url}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                          placeholder="https://example.com or /path/to/page (optional)"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Full URL (http://...) or relative path (/path). Leave empty if no redirect needed.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  // Add multiple keywords
                  <>
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Add Keywords</h2>
                        <button
                          type="button"
                          onClick={addKeywordItem}
                          className="inline-flex items-center rounded-md bg-green-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
                        >
                          + Add Another Keyword
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Add multiple keywords at once. Redirect URL is optional.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {keywordItems.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-md border border-gray-200 p-4 bg-gray-50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-gray-800">
                              Keyword {index + 1}
                            </p>
                            {keywordItems.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeKeywordItem(index)}
                                className="text-xs text-red-600 hover:text-red-700 font-medium"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Keyword <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={item.keyword}
                                onChange={(e) =>
                                  handleKeywordItemChange(index, 'keyword', e.target.value)
                                }
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                placeholder="Enter keyword"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Redirect URL <span className="text-xs text-gray-500">(Optional)</span>
                              </label>
                              <input
                                type="text"
                                value={item.redirect_url}
                                onChange={(e) =>
                                  handleKeywordItemChange(index, 'redirect_url', e.target.value)
                                }
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                placeholder="https://example.com or /path/to/page (optional)"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Submit Buttons */}
                <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200">
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
                    className="inline-flex items-center rounded-md bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? 'Saving...'
                      : editingId
                      ? 'Update Keyword'
                      : 'Add Keywords'}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Keywords List */}
                {loading ? (
                  <div className="bg-white shadow rounded-lg p-6 text-sm text-gray-600">
                    Loading keywords...
                  </div>
                ) : keywords.length === 0 ? (
                  <div className="bg-white shadow rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-600 mb-4">No keywords found.</p>
                    <button
                      onClick={() => {
                        resetForm();
                        setShowForm(true);
                      }}
                      className="inline-flex items-center rounded-md bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800"
                    >
                      Add Your First Keyword
                    </button>
                  </div>
                ) : (
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <h3 className="text-sm font-semibold text-gray-900">
                            Total Keywords: {keywords.length}
                          </h3>
                          {selectedKeywords.length > 0 && (
                            <span className="text-xs text-blue-600 font-medium">
                              {selectedKeywords.length} selected
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedKeywords.length > 0 && (
                            <button
                              onClick={handleBulkDelete}
                              disabled={bulkDeleting}
                              className="inline-flex items-center rounded-md bg-red-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:opacity-60"
                            >
                              {bulkDeleting ? 'Deleting...' : `Delete Selected (${selectedKeywords.length})`}
                            </button>
                          )}
                          <button
                            onClick={handleSelectAll}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            {selectedKeywords.length === keywords.length ? 'Deselect All' : 'Select All'}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left">
                              <input
                                type="checkbox"
                                checked={selectedKeywords.length === keywords.length && keywords.length > 0}
                                onChange={handleSelectAll}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                              />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Keyword
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Redirect URL
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Clicks
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Created
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {keywords.map((keyword) => (
                            <tr key={keyword.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={selectedKeywords.includes(keyword.id)}
                                  onChange={() => handleSelectKeyword(keyword.id)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                #{keyword.id}
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {keyword.keyword}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 max-w-md truncate">
                                  {keyword.redirect_url ? (
                                    <a
                                      href={keyword.redirect_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                      {keyword.redirect_url}
                                    </a>
                                  ) : (
                                    <span className="text-gray-400 italic">No redirect URL</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => handleToggle(keyword.id, keyword.is_active)}
                                  disabled={toggling === keyword.id}
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    keyword.is_active
                                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                  } disabled:opacity-60`}
                                >
                                  {toggling === keyword.id
                                    ? '...'
                                    : keyword.is_active
                                    ? 'Active'
                                    : 'Inactive'}
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {keyword.clicks || 0}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {keyword.created_at
                                  ? new Date(keyword.created_at).toLocaleDateString()
                                  : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => handleEdit(keyword)}
                                  className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(keyword.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddKeywords;

