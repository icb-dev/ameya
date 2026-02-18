import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || 'https://seagreen-porcupine-656193.hostingersite.com';

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    setError('');
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
        setError(data.message || 'Failed to load profile');
        setLoading(false);
        return;
      }

      const data = await res.json();
      setProfile(data.profile || data.user || null);
      setLoading(false);
    } catch (err) {
      setError('Unable to reach server. Please try again.');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/admin/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      // ignore errors on logout
    } finally {
      navigate('/admin/login');
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage admin profile and sessions.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Logout
              </button>
            </div>

            {loading && (
              <div className="bg-white shadow rounded-lg p-6 text-sm text-gray-600">
                Loading profile...
              </div>
            )}

            {error && !loading && (
              <div className="bg-white shadow rounded-lg p-6 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            {!loading && !error && profile && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
                  <dl className="space-y-3 text-sm text-gray-800">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Username</dt>
                      <dd className="font-medium">{profile.username || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Email</dt>
                      <dd className="font-medium">{profile.email || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Role</dt>
                      <dd className="font-medium uppercase">{profile.role || 'ADMIN'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">ID</dt>
                      <dd className="font-medium">{profile.id || '-'}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Session</h2>
                  <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
                    <li>JWT set via HttpOnly cookie after login.</li>
                    <li>Protected endpoints require valid token.</li>
                    <li>Rate limit on login: 12 attempts / 15 minutes.</li>
                    <li>Use logout to clear cookie.</li>
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

export default Dashboard;
