import { Link } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminHome() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mb-8">
            Welcome to the admin panel. Use the sidebar to navigate to different sections.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Commercial Projects
              </h2>
              <p className="text-gray-600 mb-4">
                Upload and manage commercial real estate projects.
              </p>
              <Link
                to="/admin/commercial"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Commercial Projects →
              </Link>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Residential Projects
              </h2>
              <p className="text-gray-600 mb-4">
                Upload and manage residential real estate projects.
              </p>
              <Link
                to="/admin/residential"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Residential Projects →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
