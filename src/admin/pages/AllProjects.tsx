import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllProjects, deleteProject, type Project } from "../../services/api";
import AdminSidebar from "../components/AdminSidebar";
import AdminFooter from "../components/AdminFooter";

export default function AllProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      console.log("=== Starting to fetch projects ===");
      const data = await fetchAllProjects();
      console.log("=== Projects fetched successfully ===");
      console.log("Fetched projects:", data);
      console.log("Total projects:", data.length);
      console.log("Projects array:", JSON.stringify(data, null, 2));
      
      if (data.length === 0) {
        console.warn("No projects returned from API!");
      }
      
      setProjects(data);
    } catch (error) {
      console.error("=== Error fetching projects ===");
      console.error("Error details:", error);
      alert(`Failed to load projects: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string, projectName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(projectId);
      await deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      alert("Project deleted successfully ✅");
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Normalize project_type for filtering (trim whitespace and convert to lowercase)
  const commercialProjects = projects.filter(p => {
    if (!p.project_type) return false;
    const type = String(p.project_type).trim().toLowerCase();
    return type === "commercial";
  });
  const residentialProjects = projects.filter(p => {
    if (!p.project_type) return false;
    const type = String(p.project_type).trim().toLowerCase();
    return type === "residential";
  });

  // Debug logging
  useEffect(() => {
    if (projects.length > 0) {
      console.log("=== PROJECT DEBUG INFO ===");
      console.log("Total projects fetched:", projects.length);
      console.log("All projects:", projects);
      console.log("Commercial count:", commercialProjects.length);
      console.log("Residential count:", residentialProjects.length);
      console.log("Unique project types:", [...new Set(projects.map(p => `"${p.project_type}"`))]);
      projects.forEach((p, idx) => {
        console.log(`Project ${idx + 1}:`, {
          id: p.id,
          name: p.project_name,
          type: `"${p.project_type}"`,
          typeLength: p.project_type?.length,
          normalizedType: p.project_type?.trim().toLowerCase()
        });
      });
    }
  }, [projects, commercialProjects.length, residentialProjects.length]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {project.project_thumbnail ? (
          <img
            src={project.project_thumbnail}
            alt={project.project_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            project.status === "completed"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}>
            {project.status === "completed" ? "Completed" : "Ongoing"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Logo */}
        {project.project_logo && (
          <div className="mb-3">
            <img
              src={project.project_logo}
              alt={`${project.project_name} logo`}
              className="h-12 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Project Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {project.project_name}
        </h3>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{project.city}</span>
            {project.sector && <span className="text-gray-400">•</span>}
            {project.sector && <span>{project.sector}</span>}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Created: {formatDate(project.created_at)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
            className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2m-1 0v14m-7-7h14" />
            </svg>
            <span>Edit</span>
          </button>
          <button
            onClick={() => handleDelete(project.id, project.project_name)}
            disabled={deletingId === project.id}
            className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {deletingId === project.id ? (
              <>
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 relative">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-200/20 rounded-full blur-3xl"></div>
        </div>

        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 ml-64 p-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-10 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    All Projects
                  </h2>
                </div>
                <button
                  onClick={loadProjects}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg 
                    className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{loading ? "Refreshing..." : "Refresh"}</span>
                </button>
              </div>
              <p className="text-gray-600 mt-2 text-lg ml-4">
                View and manage all commercial and residential projects.
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600 font-medium">Loading projects...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Debug Info - Remove in production */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-sm">
                    <p className="font-semibold text-yellow-800 mb-2">Debug Info:</p>
                    <p>API Base URL: {import.meta.env.VITE_API_BASE_URL || "NOT SET"}</p>
                    <p>Full API URL: {import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/projects` : "NOT SET"}</p>
                    <p>Total Projects: {projects.length}</p>
                    <p>Commercial: {commercialProjects.length}</p>
                    <p>Residential: {residentialProjects.length}</p>
                    <p>Project Types: {projects.length > 0 ? [...new Set(projects.map(p => p.project_type))].join(", ") : "None"}</p>
                    {projects.length > 0 && (
                      <details className="mt-2">
                        <summary className="cursor-pointer font-semibold">View All Projects Data</summary>
                        <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-40">
                          {JSON.stringify(projects, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
                {/* Commercial Projects */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Commercial Projects
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      {commercialProjects.length}
                    </span>
                  </div>

                  {commercialProjects.length === 0 ? (
                    <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <p className="text-gray-500 font-medium text-lg">No commercial projects found</p>
                      <p className="text-gray-400 text-sm mt-1">Create your first commercial project to get started.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {commercialProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  )}
                </section>

                {/* Residential Projects */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-green-600 to-green-400 rounded-full"></div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Residential Projects
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      {residentialProjects.length}
                    </span>
                  </div>

                  {residentialProjects.length === 0 ? (
                    <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <p className="text-gray-500 font-medium text-lg">No residential projects found</p>
                      <p className="text-gray-400 text-sm mt-1">Create your first residential project to get started.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {residentialProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
      <AdminFooter />
    </>
  );
}
