import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import Toast from "../components/Toast";
import BlogForm, { type BlogUpsertPayload } from "../components/blogs/BlogForm";
import { adminCreateBlog } from "../../services/blogs";

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  try {
    return JSON.stringify(e);
  } catch {
    return "Unknown error";
  }
}

export default function NewBlog() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (payload: BlogUpsertPayload) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await adminCreateBlog(payload);
      const r = typeof res === "object" && res !== null ? (res as Record<string, unknown>) : null;
      const blogObj =
        typeof r?.blog === "object" && r.blog !== null ? (r.blog as Record<string, unknown>) : null;
      const dataObj =
        typeof r?.data === "object" && r.data !== null ? (r.data as Record<string, unknown>) : null;
      const id =
        (typeof r?.id === "string" ? r.id : null) ||
        (typeof blogObj?.id === "string" ? blogObj.id : null) ||
        (typeof dataObj?.id === "string" ? dataObj.id : null);

      setToast("Blog created");
      if (id) setTimeout(() => navigate(`/admin/blogs/${id}/edit`), 1500);
      else setTimeout(() => navigate("/admin/blogs"), 1500);
    } catch (e: unknown) {
      setError(getErrorMessage(e) || "Create failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">New blog</h1>
              <p className="text-gray-600 mt-1">Write content in TinyMCE, add SEO + images.</p>
            </div>
            <Link
              to="/admin/blogs"
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
            >
              ← Back
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
              {error}
            </div>
          )}

          <BlogForm submitting={submitting} onSubmit={onSubmit} submitLabel="Create blog" />

          {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
      </div>
    </div>
  );
}

