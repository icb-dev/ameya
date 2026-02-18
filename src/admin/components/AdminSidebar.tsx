import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isUploadOpen, setIsUploadOpen] = useState(
    location.pathname.includes("/admin/commercial") || 
    location.pathname.includes("/admin/residential")
  );

  const isActive = (path: string) => location.pathname === path;
  const isActivePrefix = (prefix: string) => location.pathname.startsWith(prefix);

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-black text-white shadow-lg z-50">
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-800">
        <img src="/logo.png" alt="Logo" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Home */}
          <Link
            to="/admin"
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${
                isActive("/admin")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }
            `}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="font-medium">Home</span>
          </Link>

          {/* View Projects */}
          <Link
            to="/admin/projects"
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${
                isActive("/admin/projects")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }
            `}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <span className="font-medium">View Projects</span>
          </Link>

          {/* Home Management */}
          <Link
            to="/admin/home"
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${
                isActive("/admin/home")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }
            `}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>
            <span className="font-medium">Home Banner</span>
          </Link>

          {/* About Management */}
          <Link
            to="/admin/about"
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${
                isActive("/admin/about")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }
            `}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">About Section</span>
          </Link>

          {/* Blogs */}
          <Link
            to="/admin/blogs"
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${
                isActivePrefix("/admin/blogs")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 5H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2zM7 9h10M7 13h10M7 17h6"
              />
            </svg>
            <span className="font-medium">Blogs</span>
          </Link>

          {/* Upload Project Dropdown */}
          <div>
            <button
              onClick={() => setIsUploadOpen(!isUploadOpen)}
              className={`
                w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${
                  isUploadOpen || location.pathname.includes("/admin/commercial") || location.pathname.includes("/admin/residential")
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="font-medium">Upload Project</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isUploadOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isUploadOpen && (
              <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-700 pl-4">
                <Link
                  to="/admin/commercial"
                  className={`
                    flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
                    ${
                      isActive("/admin/commercial")
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                    }
                  `}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span className="text-sm">Commercial Project</span>
                </Link>

                <Link
                  to="/admin/residential"
                  className={`
                    flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
                    ${
                      isActive("/admin/residential")
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                    }
                  `}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span className="text-sm">Residential Project</span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Footer: user + change password + logout */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          {user && (
            <div className="text-xs text-gray-400 truncate px-2" title={user.username}>
              {user.username}
            </div>
          )}
          <Link
            to="/admin/change-password"
            className={`
              w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all
              ${
                isActive("/admin/change-password")
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Change password
          </Link>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white text-sm transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
          <div className="text-xs text-gray-500 text-center pt-1">
            Admin Dashboard v1.0
          </div>
        </div>
      </div>
    </div>
  );
}
