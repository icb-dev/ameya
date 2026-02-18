import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminFooter from "../components/AdminFooter";
import { uploadSingleImage } from "../../services/upload";
import {
  fetchAllHomeEntries,
  createHomeEntry,
  updateHomeEntry,
  deleteHomeEntry,
  type HomeEntry,
  type CreateHomeEntryPayload,
  type UpdateHomeEntryPayload,
} from "../../services/api";

type FormMode = "create" | "edit" | null;

interface FormData {
  banner_image: string;
  title: string;
  large_title: string;
  button_url: string;
}

export default function Home() {
  const [entries, setEntries] = useState<HomeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    banner_image: "",
    title: "",
    large_title: "",
    button_url: "",
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const data = await fetchAllHomeEntries();
      setEntries(data);
    } catch (error) {
      console.error("Failed to load home entries:", error);
      alert("Failed to load home entries");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const url = await uploadSingleImage("home", file);
      setFormData({ ...formData, banner_image: url });
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const openCreateForm = () => {
    setFormMode("create");
    setEditingId(null);
    setFormData({
      banner_image: "",
      title: "",
      large_title: "",
      button_url: "",
    });
  };

  const openEditForm = (entry: HomeEntry) => {
    setFormMode("edit");
    setEditingId(entry.id);
    setFormData({
      banner_image: entry.banner_image,
      title: entry.title,
      large_title: entry.large_title,
      button_url: entry.button_url,
    });
  };

  const closeForm = () => {
    setFormMode(null);
    setEditingId(null);
    setFormData({
      banner_image: "",
      title: "",
      large_title: "",
      button_url: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.banner_image || !formData.title || !formData.large_title || !formData.button_url) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setSaving(true);

      if (formMode === "create") {
        await createHomeEntry(formData as CreateHomeEntryPayload);
        alert("Home entry created successfully! ✅");
      } else if (formMode === "edit" && editingId) {
        await updateHomeEntry(editingId, formData as UpdateHomeEntryPayload);
        alert("Home entry updated successfully! ✅");
      }

      closeForm();
      await loadEntries();
    } catch (error) {
      console.error("Failed to save home entry:", error);
      alert("Failed to save home entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this home entry?")) {
      return;
    }

    try {
      await deleteHomeEntry(id);
      alert("Home entry deleted successfully! ✅");
      await loadEntries();
    } catch (error) {
      console.error("Failed to delete home entry:", error);
      alert("Failed to delete home entry");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 font-medium">Loading home entries...</p>
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
                      Home Management
                    </h2>
                  </div>
                  <p className="text-gray-600 text-lg ml-4">
                    Manage home page banner and hero section content
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
                      {formMode === "create" ? "Create New Home Entry" : "Edit Home Entry"}
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
                  {/* Banner Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Banner Image *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      disabled={uploading}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                    />
                    {uploading && (
                      <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        Uploading image...
                      </p>
                    )}
                    {formData.banner_image && !uploading && (
                      <div className="mt-3">
                        <img
                          src={formData.banner_image}
                          alt="Banner preview"
                          className="w-full max-w-md h-48 object-cover border border-gray-200 rounded-lg bg-gray-50"
                        />
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Welcome"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm hover:shadow-md"
                      required
                    />
                  </div>

                  {/* Large Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Large Title *
                    </label>
                    <input
                      type="text"
                      value={formData.large_title}
                      onChange={(e) => setFormData({ ...formData, large_title: e.target.value })}
                      placeholder="e.g., Welcome to Ameya"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm hover:shadow-md"
                      required
                    />
                  </div>

                  {/* Button URL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Button URL *
                    </label>
                    <input
                      type="url"
                      value={formData.button_url}
                      onChange={(e) => setFormData({ ...formData, button_url: e.target.value })}
                      placeholder="https://example.com/contact"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm hover:shadow-md"
                      required
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={saving || uploading}
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
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Home Entries Yet</h3>
                    <p className="text-gray-600 mb-6">
                      Create your first home entry to get started with managing your homepage content.
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
                        <div className="flex flex-col md:flex-row">
                          {/* Banner Image */}
                          <div className="md:w-1/3 h-64 md:h-auto">
                            <img
                              src={entry.banner_image}
                              alt={entry.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-6">
                            <div className="mb-4">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {entry.large_title}
                              </h3>
                              <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Subtitle:</span> {entry.title}
                              </p>
                              <a
                                href={entry.button_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                {entry.button_url}
                              </a>
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
                                Edit
                              </button>

                              <button
                                onClick={() => handleDelete(entry.id)}
                                className="flex-1 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-semibold flex items-center justify-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
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
