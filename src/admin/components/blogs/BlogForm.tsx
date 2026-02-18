import { useEffect, useMemo, useState } from "react";
import type { Blog, BlogImageInput, BlogSeo, BlogStatus } from "../../../services/blogs";
import RichTextEditor from "./RichTextEditor";
import { uploadSingleImage } from "../../../services/upload";

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  try {
    return JSON.stringify(e);
  } catch {
    return "Unknown error";
  }
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

type MetadataRow = { key: string; value: string };

export type BlogUpsertPayload = {
  title: string;
  slug: string;
  category: string | null;
  excerpt: string | null;
  content: string;
  status: BlogStatus;
  published_at: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  images: Array<{ image_url: string; alt_text: string; position: number }>;
  seo: BlogSeo;
  metadata: Record<string, string>;
};

type Props = {
  initial?: Partial<Blog>;
  submitting?: boolean;
  onSubmit: (payload: BlogUpsertPayload) => Promise<void> | void;
  submitLabel?: string;
};

export default function BlogForm({
  initial,
  submitting,
  onSubmit,
  submitLabel = "Save",
}: Props) {
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [category, setCategory] = useState(initial?.category ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [status, setStatus] = useState<BlogStatus>((initial?.status as BlogStatus) || "draft");
  const [publishedAt, setPublishedAt] = useState<string>(() => {
    const v = initial?.published_at;
    if (!v) return "";
    try {
      const d = new Date(v);
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
        d.getHours()
      )}:${pad(d.getMinutes())}`;
    } catch {
      return "";
    }
  });

  const [coverImageUrl, setCoverImageUrl] = useState(initial?.cover_image_url || "");
  const [coverImageAlt, setCoverImageAlt] = useState(initial?.cover_image_alt || "");
  const [content, setContent] = useState(initial?.content || "");

  const [images, setImages] = useState<BlogImageInput[]>(
    Array.isArray(initial?.images) ? (initial?.images as BlogImageInput[]) : []
  );

  const initialSeo = (initial?.seo || {}) as BlogSeo;
  const [seo, setSeo] = useState<BlogSeo>({
    metaTitle: initialSeo.metaTitle || "",
    metaDescription: initialSeo.metaDescription || "",
    metaKeywords: initialSeo.metaKeywords || "",
    canonicalUrl: initialSeo.canonicalUrl || "",
    robots: initialSeo.robots || "",
    og: {
      title: initialSeo.og?.title || "",
      description: initialSeo.og?.description || "",
      imageUrl: initialSeo.og?.imageUrl || "",
      imageAlt: initialSeo.og?.imageAlt || "",
    },
    twitter: {
      title: initialSeo.twitter?.title || "",
      description: initialSeo.twitter?.description || "",
      imageUrl: initialSeo.twitter?.imageUrl || "",
      imageAlt: initialSeo.twitter?.imageAlt || "",
    },
    schemaJsonLd: initialSeo.schemaJsonLd,
  });

  const [schemaJsonLdText, setSchemaJsonLdText] = useState(() => {
    if (!initialSeo?.schemaJsonLd) return "";
    try {
      return JSON.stringify(initialSeo.schemaJsonLd, null, 2);
    } catch {
      return "";
    }
  });
  const [schemaError, setSchemaError] = useState<string | null>(null);

  const [metadataRows, setMetadataRows] = useState<MetadataRow[]>(() => {
    const m = initial?.metadata;
    if (!m) return [];
    if (Array.isArray(m)) {
      return m
        .map((row: unknown) => {
          const r = row as { key?: unknown; value?: unknown } | null;
          return { key: String(r?.key || ""), value: String(r?.value || "") };
        })
        .filter((r) => r.key || r.value);
    }
    if (typeof m === "object") {
      return Object.entries(m as Record<string, unknown>).map(([k, v]) => ({
        key: String(k),
        value: typeof v === "string" ? v : JSON.stringify(v),
      }));
    }
    return [];
  });

  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return !!title.trim() && !!content.trim() && !submitting;
  }, [title, content, submitting]);

  useEffect(() => {
    if (slugTouched) return;
    setSlug(slugify(title));
  }, [title, slugTouched]);

  const onUploadCover = async (file: File) => {
    setCoverUploadError(null);
    setCoverUploading(true);
    try {
      const url = await uploadSingleImage("blogs", file);
      setCoverImageUrl(url);
      if (!coverImageAlt) setCoverImageAlt(title ? `${title} cover image` : "");
    } catch (e: unknown) {
      setCoverUploadError(getErrorMessage(e) || "Cover upload failed");
    } finally {
      setCoverUploading(false);
    }
  };

  const addImageRow = () => {
    setImages((prev) => [...prev, { image_url: "", alt_text: "", position: prev.length }]);
  };
  const updateImageRow = (idx: number, patch: Partial<BlogImageInput>) => {
    setImages((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };
  const removeImageRow = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));
  const uploadInlineImage = async (idx: number, file: File) => {
    try {
      const url = await uploadSingleImage("blogs", file);
      updateImageRow(idx, { image_url: url });
    } catch (e: unknown) {
      alert(getErrorMessage(e) || "Image upload failed");
    }
  };

  const addMetadataRow = () => setMetadataRows((prev) => [...prev, { key: "", value: "" }]);
  const updateMetadataRow = (idx: number, patch: Partial<MetadataRow>) => {
    setMetadataRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };
  const removeMetadataRow = (idx: number) => setMetadataRows((prev) => prev.filter((_, i) => i !== idx));

  const metadataObject = useMemo(() => {
    const obj: Record<string, string> = {};
    metadataRows.forEach((r) => {
      const k = r.key.trim();
      if (!k) return;
      obj[k] = r.value;
    });
    return obj;
  }, [metadataRows]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSchemaError(null);

    let schemaJsonLd: unknown = undefined;
    const schemaText = schemaJsonLdText.trim();
    if (schemaText) {
      try {
        schemaJsonLd = JSON.parse(schemaText);
      } catch {
        setSchemaError("Schema JSON-LD must be valid JSON.");
        return;
      }
    }

    const payload: BlogUpsertPayload = {
      title: title.trim(),
      slug: (slug || slugify(title)).trim(),
      category: category?.trim() || null,
      excerpt: excerpt?.trim() || null,
      content,
      status,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
      cover_image_url: coverImageUrl?.trim() || null,
      cover_image_alt: coverImageAlt?.trim() || null,
      images: images
        .filter((img) => !!img.image_url)
        .map((img, i) => ({
          image_url: img.image_url,
          alt_text: img.alt_text || "",
          position: typeof img.position === "number" ? img.position : i,
        })),
      seo: {
        metaTitle: seo.metaTitle || "",
        metaDescription: seo.metaDescription || "",
        metaKeywords: seo.metaKeywords || "",
        canonicalUrl: seo.canonicalUrl || "",
        robots: seo.robots || "",
        og: seo.og || {},
        twitter: seo.twitter || {},
        ...(schemaText ? { schemaJsonLd } : {}),
      },
      metadata: metadataObject,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Blog title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. News, Updates, Insights"
          />
          <div className="text-xs text-gray-500 mt-1">Optional. Used to group blogs (e.g. News, Updates).</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="my-blog-post"
            />
            <div className="text-xs text-gray-500 mt-1">
              Used for the public URL. Leave blank to auto-generate from title.
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BlogStatus)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
          <textarea
            value={excerpt || ""}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Short summary for listing/SEO"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Published at</label>
          <input
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-xs text-gray-500 mt-1">
            Optional. If missing, backend can set this when publishing.
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Cover image</h2>
          <label className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black cursor-pointer text-sm">
            {coverUploading ? "Uploading…" : "Upload cover"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={coverUploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) void onUploadCover(f);
              }}
            />
          </label>
        </div>

        {coverUploadError && <div className="text-sm text-red-600">{coverUploadError}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover image URL</label>
            <input
              value={coverImageUrl || ""}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://… or /uploads/…"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alt text</label>
            <input
              value={coverImageAlt || ""}
              onChange={(e) => setCoverImageAlt(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the cover image"
            />
          </div>
        </div>

        {coverImageUrl ? (
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
            <img src={coverImageUrl} alt={coverImageAlt || "Cover preview"} className="max-h-56 rounded-md" />
          </div>
        ) : null}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Content *</h2>
        <RichTextEditor value={content} onChange={setContent} disabled={!!submitting} />
        <div className="text-xs text-gray-500">Editor saves HTML into `content`.</div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Images (optional)</h2>
          <button
            type="button"
            onClick={addImageRow}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black text-sm"
          >
            Add image
          </button>
        </div>

        {images.length === 0 ? (
          <div className="text-sm text-gray-500">No images added.</div>
        ) : (
          <div className="space-y-3">
            {images.map((img, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-gray-800">Image #{idx + 1}</div>
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 text-sm bg-gray-100 rounded-md border border-gray-200 hover:bg-gray-200 cursor-pointer">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          e.target.value = "";
                          if (f) void uploadInlineImage(idx, f);
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeImageRow(idx)}
                      className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      value={img.image_url || ""}
                      onChange={(e) => updateImageRow(idx, { image_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="/uploads/blogs/…"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input
                      type="number"
                      value={typeof img.position === "number" ? img.position : idx}
                      onChange={(e) => updateImageRow(idx, { position: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alt text</label>
                  <input
                    value={img.alt_text || ""}
                    onChange={(e) => updateImageRow(idx, { alt_text: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the image"
                  />
                </div>

                {img.image_url ? (
                  <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <img src={img.image_url} alt={img.alt_text || "Blog image preview"} className="max-h-56 rounded-md" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">SEO</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta title</label>
            <input
              value={seo.metaTitle || ""}
              onChange={(e) => setSeo((s) => ({ ...s, metaTitle: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional (defaults to title)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
            <input
              value={seo.canonicalUrl || ""}
              onChange={(e) => setSeo((s) => ({ ...s, canonicalUrl: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/blog/slug"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta description</label>
          <textarea
            value={seo.metaDescription || ""}
            onChange={(e) => setSeo((s) => ({ ...s, metaDescription: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Search snippet description"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta keywords</label>
            <input
              value={seo.metaKeywords || ""}
              onChange={(e) => setSeo((s) => ({ ...s, metaKeywords: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="keyword1, keyword2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Robots</label>
            <input
              value={seo.robots || ""}
              onChange={(e) => setSeo((s) => ({ ...s, robots: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="index,follow"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-800">Open Graph</div>
            <input
              value={seo.og?.title || ""}
              onChange={(e) => setSeo((s) => ({ ...s, og: { ...(s.og || {}), title: e.target.value } }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="og:title"
            />
            <textarea
              value={seo.og?.description || ""}
              onChange={(e) => setSeo((s) => ({ ...s, og: { ...(s.og || {}), description: e.target.value } }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={2}
              placeholder="og:description"
            />
            <input
              value={seo.og?.imageUrl || ""}
              onChange={(e) => setSeo((s) => ({ ...s, og: { ...(s.og || {}), imageUrl: e.target.value } }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="og:image URL"
            />
            <input
              value={seo.og?.imageAlt || ""}
              onChange={(e) => setSeo((s) => ({ ...s, og: { ...(s.og || {}), imageAlt: e.target.value } }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="og:image:alt"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-800">Twitter</div>
            <input
              value={seo.twitter?.title || ""}
              onChange={(e) => setSeo((s) => ({ ...s, twitter: { ...(s.twitter || {}), title: e.target.value } }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="twitter:title"
            />
            <textarea
              value={seo.twitter?.description || ""}
              onChange={(e) =>
                setSeo((s) => ({ ...s, twitter: { ...(s.twitter || {}), description: e.target.value } }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={2}
              placeholder="twitter:description"
            />
            <input
              value={seo.twitter?.imageUrl || ""}
              onChange={(e) =>
                setSeo((s) => ({ ...s, twitter: { ...(s.twitter || {}), imageUrl: e.target.value } }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="twitter:image URL"
            />
            <input
              value={seo.twitter?.imageAlt || ""}
              onChange={(e) =>
                setSeo((s) => ({ ...s, twitter: { ...(s.twitter || {}), imageAlt: e.target.value } }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="twitter:image:alt"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Schema JSON-LD</label>
          <textarea
            value={schemaJsonLdText}
            onChange={(e) => setSchemaJsonLdText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={8}
            placeholder='{"@context":"https://schema.org","@type":"BlogPosting",...}'
          />
          {schemaError && <div className="mt-1 text-sm text-red-600">{schemaError}</div>}
          <div className="text-xs text-gray-500 mt-1">Optional. Must be valid JSON if provided.</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Metadata (free-form)</h2>
          <button
            type="button"
            onClick={addMetadataRow}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black text-sm"
          >
            Add field
          </button>
        </div>

        {metadataRows.length === 0 ? (
          <div className="text-sm text-gray-500">No metadata fields.</div>
        ) : (
          <div className="space-y-2">
            {metadataRows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
                <input
                  value={row.key}
                  onChange={(e) => updateMetadataRow(idx, { key: e.target.value })}
                  className="md:col-span-4 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="key"
                />
                <input
                  value={row.value}
                  onChange={(e) => updateMetadataRow(idx, { value: e.target.value })}
                  className="md:col-span-7 px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="value"
                />
                <button
                  type="button"
                  onClick={() => removeMetadataRow(idx)}
                  className="md:col-span-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className={[
            "px-6 py-3 rounded-lg text-white font-semibold transition-colors",
            canSubmit ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed",
          ].join(" ")}
        >
          {submitting ? "Saving…" : submitLabel}
        </button>
        <div className="text-sm text-gray-500">Fields marked * are required.</div>
      </div>
    </form>
  );
}

