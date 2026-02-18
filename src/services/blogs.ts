import { getAuthHeaders } from "./api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type BlogStatus = "draft" | "published";

export interface BlogSeoOgTwitter {
  title?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface BlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  robots?: string;
  og?: BlogSeoOgTwitter;
  twitter?: BlogSeoOgTwitter;
  schemaJsonLd?: unknown;
}

export interface BlogImageInput {
  image_url: string;
  alt_text?: string;
  position?: number;
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  category?: string | null;
  excerpt?: string | null;
  content: string;
  cover_image_url?: string | null;
  cover_image_alt?: string | null;
  status: BlogStatus;
  published_at?: string | null;
  seo?: BlogSeo | null;
  metadata?: unknown;
  images?: BlogImageInput[];
  created_at?: string;
  updated_at?: string;
}

export interface AdminBlogListQuery {
  status?: BlogStatus | "";
  q?: string;
  page?: number;
  limit?: number;
}

function toQueryString(params: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

async function readJsonOrThrow(res: Response): Promise<unknown> {
  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message?: unknown }).message === "string"
        ? (data as { message: string }).message
        : null;
    throw new Error(message || `Request failed (${res.status})`);
  }
  return data;
}

export async function adminListBlogs(query: AdminBlogListQuery = {}): Promise<Blog[]> {
  const qs = toQueryString(query as unknown as Record<string, unknown>);
  const res = await fetch(`${BASE_URL}/admin/blogs${qs}`, { headers: getAuthHeaders() });
  const data = await readJsonOrThrow(res);

  if (Array.isArray(data)) return data as Blog[];
  if (typeof data === "object" && data !== null && "items" in data) {
    const items = (data as { items?: unknown }).items;
    if (Array.isArray(items)) return items as Blog[];
  }
  if (typeof data === "object" && data !== null && "data" in data) {
    const rows = (data as { data?: unknown }).data;
    if (Array.isArray(rows)) return rows as Blog[];
  }
  return [];
}

export async function adminGetBlog(id: string): Promise<Blog> {
  const res = await fetch(`${BASE_URL}/admin/blogs/${id}`, { headers: getAuthHeaders() });
  const data = await readJsonOrThrow(res);
  return data as Blog;
}

export type AdminCreateBlogPayload = Omit<Blog, "id" | "created_at" | "updated_at">;
export type AdminUpdateBlogPayload = Partial<AdminCreateBlogPayload>;

export async function adminCreateBlog(payload: AdminCreateBlogPayload): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/admin/blogs`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return readJsonOrThrow(res);
}

export async function adminUpdateBlog(
  id: string,
  payload: AdminUpdateBlogPayload
): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/admin/blogs/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return readJsonOrThrow(res);
}

export async function adminDeleteBlog(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/blogs/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (res.status === 404) return;
  await readJsonOrThrow(res);
}

export async function adminPublishBlog(id: string): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/admin/blogs/${id}/publish`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return readJsonOrThrow(res);
}

export async function adminUnpublishBlog(id: string): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/admin/blogs/${id}/unpublish`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return readJsonOrThrow(res);
}

