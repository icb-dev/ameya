import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import Toast from "../components/Toast";
import BlogForm, { type BlogUpsertPayload } from "../components/blogs/BlogForm";
import type { Blog } from "../../services/blogs";
import {
  adminDeleteBlog,
  adminGetBlog,
  adminPublishBlog,
  adminUnpublishBlog,
  adminUpdateBlog,
} from "../../services/blogs";

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  try {
    return JSON.stringify(e);
  } catch {
    return "Unknown error";
  }
}

export default function EditBlog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetBlog(id);
      setBlog(data);
    } catch (e: unknown) {
      setError(getErrorMessage(e) || "Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (payload: BlogUpsertPayload) => {
    if (!id) return;
    setSubmitting(true);
    setError(null);
    try {
      await adminUpdateBlog(id, payload);
      await load();
      setToast("Blog updated");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: unknown) {
      setError(getErrorMessage(e) || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!id) return;
    const ok = window.confirm("Delete this blog? This cannot be undone.");
    if (!ok) return;
    try {
      await adminDeleteBlog(id);
      navigate("/admin/blogs");
    } catch (e: unknown) {
      alert(getErrorMessage(e) || "Delete failed");
    }
  };

  const onTogglePublish = async () => {
    if (!id || !blog) return;
    try {
      if (blog.status === "published") {
        await adminUnpublishBlog(id);
        setToast("Unpublished");
      } else {
        await adminPublishBlog(id);
        setToast("Published");
      }
      await load();
    } catch (e: unknown) {
      alert(getErrorMessage(e) || "Action failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit blog</h1>
              <p className="text-gray-600 mt-1">
                {blog ? (
                  <>
                    <span className="font-medium text-gray-900">{blog.title}</span>{" "}
                    <span className="text-gray-500">({blog.status})</span>
                  </>
                ) : (
                  "Loading…"
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/admin/blogs"
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
              >
                ← Back
              </Link>
              <button
                type="button"
                onClick={onTogglePublish}
                disabled={!blog}
                className={[
                  "px-4 py-2 rounded-lg text-white",
                  !blog
                    ? "bg-gray-300 cursor-not-allowed"
                    : blog.status === "published"
                      ? "bg-gray-700 hover:bg-gray-800"
                      : "bg-green-600 hover:bg-green-700",
                ].join(" ")}
              >
                {blog?.status === "published" ? "Unpublish" : "Publish"}
              </button>
              <button
                type="button"
                onClick={onDelete}
                disabled={!blog}
                className={[
                  "px-4 py-2 rounded-lg text-white",
                  !blog ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700",
                ].join(" ")}
              >
                Delete
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
              {error}
            </div>
          )}

          {loading && !blog ? (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-gray-500">
              Loading blog…
            </div>
          ) : blog ? (
            <BlogForm
              initial={blog}
              submitting={submitting}
              onSubmit={onSubmit}
              submitLabel="Save changes"
            />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-gray-500">
              Blog not found.
            </div>
          )}

          {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
      </div>
    </div>
  );
}

