import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminFooter from "../components/AdminFooter";
import { uploadSingleImage } from "../../services/upload";
import {
  fetchAllAboutEntries,
  createAboutEntry,
  updateAboutEntry,
  deleteAboutEntry,
  fetchAboutLogos,
  addAboutLogo,
  deleteAboutLogo,
  type AboutEntry,
  type AboutLogo,
  type CreateAboutEntryPayload,
  type UpdateAboutEntryPayload,
} from "../../services/api";

type FormMode = "create" | "edit" | null;

interface FormData {
  video_url: string;
  delivered_projects: string;
  ongoing_development: string;
  satisfied_customers: string;
  brand_partnerships: string;
}

export default function About() {
  const [entries, setEntries] = useState<AboutEntry[]>([]);
  const [logos, setLogos] = useState<AboutLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    video_url: "",
    delivered_projects: "",
    ongoing_development: "",
    satisfied_customers: "",
    brand_partnerships: "",
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const data = await fetchAllAboutEntries();
      setEntries(data);
    } catch (error) {
      console.error("Failed to load about entries:", error);
      alert("Failed to load about entries");
    } finally {
      setLoading(false);
    }
  };

  const loadLogos = async (aboutId: string) => {
    try {
      const data = await fetchAboutLogos(aboutId);
      setLogos(data);
    } catch (error) {
      console.error("Failed to load logos:", error);
      alert("Failed to load logos");
    }
  };

  const handleVideoUpload = async (file: File) => {
    try {
      setUploadingVideo(true);
      const url = await uploadSingleImage("video", file);
      setFormData({ ...formData, video_url: url });
    } catch (error) {
      console.error("Failed to upload video:", error);
      alert("Failed to upload video");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!editingId) {
      alert("Please save the about entry first before adding logos");
      return;
    }

    try {
      setUploadingLogo(true);
      const url = await uploadSingleImage("about-logos", file);
      await addAboutLogo(editingId, {
        image_url: url,
        position: logos.length + 1,
      });
      await loadLogos(editingId);
      alert("Logo added successfully! ✅");
    } catch (error) {
      console.error("Failed to upload logo:", error);
      alert("Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleDeleteLogo = async (logoId: string) => {
    if (!confirm("Are you sure you want to delete this logo?")) {
      return;
    }

    try {
      await deleteAboutLogo(logoId);
      if (editingId) {
        await loadLogos(editingId);
      }
      alert("Logo deleted successfully! ✅");
    } catch (error) {
      console.error("Failed to delete logo:", error);
      alert("Failed to delete logo");
    }
  };

  const openCreateForm = () => {
    setFormMode("create");
    setEditingId(null);
    setLogos([]);
    setFormData({
      video_url: "",
      delivered_projects: "",
      ongoing_development: "",
      satisfied_customers: "",
      brand_partnerships: "",
    });
  };

  const openEditForm = async (entry: AboutEntry) => {
    setFormMode("edit");
    setEditingId(entry.id);
    setFormData({
      video_url: entry.video_url,
      delivered_projects: entry.delivered_projects,
      ongoing_development: entry.ongoing_development,
      satisfied_customers: entry.satisfied_customers,
      brand_partnerships: entry.brand_partnerships,
    });
    await loadLogos(entry.id);
  };

  const closeForm = () => {
    setFormMode(null);
    setEditingId(null);
    setLogos([]);
    setFormData({
      video_url: "",
      delivered_projects: "",
      ongoing_development: "",
      satisfied_customers: "",
      brand_partnerships: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.video_url ||
      !formData.delivered_projects ||
      !formData.ongoing_development ||
      !formData.satisfied_customers ||
      !formData.brand_partnerships
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setSaving(true);

      if (formMode === "create") {
        const result = await createAboutEntry(formData as CreateAboutEntryPayload);
        setEditingId(result.id);
        setFormMode("edit");
        alert("About entry created successfully! ✅ You can now add logos.");
        await loadEntries();
      } else if (formMode === "edit" && editingId) {
        await updateAboutEntry(editingId, formData as UpdateAboutEntryPayload);
        alert("About entry updated successfully! ✅");
        await loadEntries();
      }
    } catch (error) {
      console.error("Failed to save about entry:", error);
      alert("Failed to save about entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this about entry? This will also delete all associated logos.")) {
      return;
    }

    try {
      await deleteAboutEntry(id);
      alert("About entry deleted successfully! ✅");
      await loadEntries();
    } catch (error) {
      console.error("Failed to delete about entry:", error);
      alert("Failed to delete about entry");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 font-medium">Loading about entries...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 relative">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-200/20 rounded-full blur-3xl"></div>
        </div>

        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 ml-64 p-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-10 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      About Management
                    </h2>
                  </div>
                  <p className="text-gray-600 text-lg ml-4">
                    Manage about section with video, stats, and brand logos
                  </p>
                </div>

                {!formMode && (
                  <button
                    onClick={openCreateForm}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Entry
                  </button>
                )}
              </div>
            </div>

            {/* Form (Create/Edit) */}
            {formMode && (
              <div className="bg-white rounded-xl border border-gray-200/80 shadow-lg shadow-gray-100/50 p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {formMode === "create" ? "Create New About Entry" : "Edit About Entry"}
                    </h3>
                  </div>
                  <button
                    onClick={closeForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Video Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Video *
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleVideoUpload(file);
                      }}
                      disabled={uploadingVideo}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                    />
                    {uploadingVideo && (
                      <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        Uploading video...
                      </p>
                    )}
                    {formData.video_url && !uploadingVideo && (
                      <div className="mt-3">
                        <video
                          src={formData.video_url}
                          controls
                          className="w-full max-w-md h-48 border border-gray-200 rounded-lg bg-gray-50"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>

                  {/* Stats Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Delivered Projects *
                      </label>
                      <input
                        type="text"
                        value={formData.delivered_projects}
                        onChange={(e) => setFormData({ ...formData, delivered_projects: e.target.value })}
                        placeholder="e.g., 5+"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm hover:shadow-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ongoing Development *
                      </label>
                      <input
                        type="text"
                        value={formData.ongoing_development}
                        onChange={(e) => setFormData({ ...formData, ongoing_development: e.target.value })}
                        placeholder="e.g., 3000+"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm hover:shadow-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Satisfied Customers *
                      </label>
                      <input
                        type="text"
                        value={formData.satisfied_customers}
                        onChange={(e) => setFormData({ ...formData, satisfied_customers: e.target.value })}
                        placeholder="e.g., 100+"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm hover:shadow-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Brand Partnerships *
                      </label>
                      <input
                        type="text"
                        value={formData.brand_partnerships}
                        onChange={(e) => setFormData({ ...formData, brand_partnerships: e.target.value })}
                        placeholder="e.g., 50+"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm hover:shadow-md"
                        required
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={saving || uploadingVideo}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {formMode === "create" ? "Create Entry" : "Update Entry"}
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={closeForm}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                {/* Logos Management (only in edit mode) */}
                {formMode === "edit" && editingId && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-1">Brand Logos</h4>
                        <p className="text-sm text-gray-600">Add and manage brand partnership logos</p>
                      </div>
                      <label className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Logo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleLogoUpload(file);
                          }}
                          disabled={uploadingLogo}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {uploadingLogo && (
                      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-blue-700 font-medium">Uploading logo...</span>
                      </div>
                    )}

                    {logos.length === 0 ? (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-600">No logos added yet. Click "Add Logo" to get started.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {logos.map((logo) => (
                          <div
                            key={logo.id}
                            className="relative group bg-white border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-all duration-300"
                          >
                            <img
                              src={logo.image_url}
                              alt={`Logo ${logo.position}`}
                              className="w-full h-20 object-contain"
                            />
                            <button
                              onClick={() => handleDeleteLogo(logo.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-lg"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Entries List */}
            {!formMode && (
              <div className="space-y-6">
                {entries.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
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
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No About Entries Yet</h3>
                    <p className="text-gray-600 mb-6">
                      Create your first about entry to showcase your company's achievements and brand partners.
                    </p>
                    <button
                      onClick={openCreateForm}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create First Entry
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        <div className="p-6">
                          {/* Video Preview */}
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Video</h4>
                            <video
                              src={entry.video_url}
                              controls
                              className="w-full max-w-2xl h-64 border border-gray-200 rounded-lg bg-gray-50"
                            >
                              Your browser does not support the video tag.
                            </video>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                              <p className="text-xs text-blue-600 font-semibold mb-1">Delivered Projects</p>
                              <p className="text-2xl font-bold text-blue-900">{entry.delivered_projects}</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                              <p className="text-xs text-green-600 font-semibold mb-1">Ongoing Development</p>
                              <p className="text-2xl font-bold text-green-900">{entry.ongoing_development}</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                              <p className="text-xs text-purple-600 font-semibold mb-1">Satisfied Customers</p>
                              <p className="text-2xl font-bold text-purple-900">{entry.satisfied_customers}</p>
                            </div>
                            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
                              <p className="text-xs text-amber-600 font-semibold mb-1">Brand Partnerships</p>
                              <p className="text-2xl font-bold text-amber-900">{entry.brand_partnerships}</p>
                            </div>
                          </div>

                          {entry.created_at && (
                            <p className="text-xs text-gray-500 mb-4">
                              Created: {new Date(entry.created_at).toLocaleDateString()}
                            </p>
                          )}

                          {/* Actions */}
                          <div className="flex gap-3">
                            <button
                              onClick={() => openEditForm(entry)}
                              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit & Manage Logos
                            </button>

                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="px-6 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-semibold flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <AdminFooter />
    </>
  );
}
