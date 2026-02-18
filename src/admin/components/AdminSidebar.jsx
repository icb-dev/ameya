import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/home-banner', label: 'Home Banner' },
    { to: '/admin/popup-image', label: 'Popup Image' },
    { to: '/admin/upload', label: 'Upload Property' },
    { to: '/admin/add-residence', label: 'Add Residence' },
    { to: '/admin/manage-residence', label: 'Manage Residence' },
    { to: '/admin/manage-properties', label: 'Manage Properties' },
    { to: '/admin/blogs', label: 'Blogs' },
    { to: '/admin/keywords', label: 'Keywords' },
    { to: '/admin/queries', label: 'Queries' },
    { to: '/admin/change-password', label: 'Change Password' },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:h-screen md:sticky md:top-0">
      <div className="px-4 py-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
        <p className="text-xs text-gray-500 mt-1">Manage properties & queries</p>
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              location.pathname === item.to
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;

