import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import Toast from "../components/Toast";
import type { Blog, BlogStatus } from "../../services/blogs";
import {
  adminDeleteBlog,
  adminListBlogs,
  adminPublishBlog,
  adminUnpublishBlog,
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

function asStatusOrEmpty(v: string): BlogStatus | "" {
  if (v === "draft" || v === "published") return v;
  return "";
}

export default function Blogs() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Blog[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<BlogStatus | "">("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const limit = 20;

  const query = useMemo(() => ({ q, status, page, limit }), [q, status, page]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminListBlogs(query);
      setItems(data);
    } catch (e: unknown) {
      setError(getErrorMessage(e) || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.q, query.status, query.page]);

  const onDelete = async (id: string) => {
    const ok = window.confirm("Delete this blog? This cannot be undone.");
    if (!ok) return;
    try {
      await adminDeleteBlog(id);
      await load();
    } catch (e: unknown) {
      alert(getErrorMessage(e) || "Delete failed");
    }
  };

  const onPublishToggle = async (blog: Blog) => {
    try {
      if (blog.status === "published") {
        await adminUnpublishBlog(blog.id);
        setToast("Unpublished");
      } else {
        await adminPublishBlog(blog.id);
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
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blogs</h1>
              <p className="text-gray-600 mt-1">
                Create, edit, publish and manage SEO/metadata.
              </p>
            </div>
            <Link
              to="/admin/blogs/new"
              className="inline-flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              + New blog
            </Link>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-7">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  value={q}
                  onChange={(e) => {
                    setPage(1);
                    setQ(e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search by title or slug…"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => {
                    setPage(1);
                    setStatus(asStatusOrEmpty(e.target.value));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="md:col-span-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => void load()}
                  className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left text-gray-600">
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Published</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td className="px-4 py-6 text-gray-500" colSpan={6}>
                        Loading…
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-gray-500" colSpan={6}>
                        No blogs found.
                      </td>
                    </tr>
                  ) : (
                    items.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{b.title}</td>
                        <td className="px-4 py-3 text-gray-700">{b.slug}</td>
                        <td className="px-4 py-3 text-gray-700">{b.category ?? "—"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={[
                              "inline-flex px-2 py-1 rounded-full text-xs font-semibold",
                              b.status === "published"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700",
                            ].join(" ")}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {b.published_at ? new Date(b.published_at).toLocaleString() : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/blogs/${b.id}/edit`}
                              className="px-3 py-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50"
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => void onPublishToggle(b)}
                              className={[
                                "px-3 py-1.5 rounded-md text-white",
                                b.status === "published"
                                  ? "bg-gray-700 hover:bg-gray-800"
                                  : "bg-green-600 hover:bg-green-700",
                              ].join(" ")}
                            >
                              {b.status === "published" ? "Unpublish" : "Publish"}
                            </button>
                            <button
                              type="button"
                              onClick={() => void onDelete(b.id)}
                              className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Page {page}</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={[
                  "px-4 py-2 rounded-lg border",
                  page <= 1
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
                ].join(" ")}
              >
                Prev
              </button>
              <button
                type="button"
                disabled={items.length < limit}
                onClick={() => setPage((p) => p + 1)}
                className={[
                  "px-4 py-2 rounded-lg border",
                  items.length < limit
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
                ].join(" ")}
              >
                Next
              </button>
            </div>
          </div>

          {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
      </div>
    </div>
  );
}

