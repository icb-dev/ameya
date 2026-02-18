const db = require("../../config/db");
const SQL = require("./blogs.sql");
const { v4: uuidv4 } = require("uuid");

function slugify(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 240);
}

function toJsonOrNull(value) {
  if (value === undefined) return undefined; // signals "not provided"
  if (value === null) return null;
  if (typeof value === "string") {
    // ensure it's valid JSON if it's intended for JSON column
    const trimmed = value.trim();
    if (!trimmed) return null;
    JSON.parse(trimmed);
    return trimmed;
  }
  return JSON.stringify(value);
}

function toMySqlDatetimeIST(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;

  // If already "YYYY-MM-DD HH:MM:SS", treat as IST and pass through.
  if (typeof value === "string") {
    const t = value.trim();
    if (!t) return null;
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(t)) {
      return t;
    }
  }

  let d = value;
  if (typeof value === "string") {
    const t = value.trim();
    if (!t) return null;
    d = new Date(t);
  }

  const toIstString = (dateObj) => {
    if (Number.isNaN(dateObj.getTime())) throw new Error("INVALID_PUBLISHED_AT");
    // convert UTC -> IST (UTC+5:30) and format "YYYY-MM-DD HH:mm:ss"
    const istMs = dateObj.getTime() + 5.5 * 60 * 60 * 1000;
    const ist = new Date(istMs);
    const pad = (n) => String(n).padStart(2, "0");
    const year = ist.getUTCFullYear();
    const month = pad(ist.getUTCMonth() + 1);
    const day = pad(ist.getUTCDate());
    const hour = pad(ist.getUTCHours());
    const min = pad(ist.getUTCMinutes());
    const sec = pad(ist.getUTCSeconds());
    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
  };

  if (d instanceof Date) {
    if (Number.isNaN(d.getTime())) throw new Error("INVALID_PUBLISHED_AT");
    return toIstString(d);
  }

  // allow numeric timestamps
  if (typeof value === "number") {
    const dt = new Date(value);
    return toIstString(dt);
  }

  throw new Error("INVALID_PUBLISHED_AT");
}

async function slugExists(slug, excludeId = "") {
  const [rows] = await db.query(SQL.COUNT_SLUG_EXISTS, [slug, excludeId]);
  return (rows?.[0]?.total || 0) > 0;
}

async function ensureUniqueSlug(baseSlug, excludeId = "") {
  let candidate = baseSlug;
  let n = 2;
  while (await slugExists(candidate, excludeId)) {
    candidate = `${baseSlug}-${n++}`;
  }
  return candidate;
}

async function getBlogById(id) {
  const [rows] = await db.query(SQL.GET_BLOG_BY_ID, [id]);
  return rows[0] || null;
}

exports.getBlogById = getBlogById;

exports.getBlogImages = async (blogId) => {
  const [rows] = await db.query(SQL.GET_IMAGES_BY_BLOG_ID, [blogId]);
  return rows;
};

exports.getBlogBySlugAny = async (slug) => {
  const [rows] = await db.query(SQL.GET_BLOG_BY_SLUG_ANY, [slug]);
  return rows[0] || null;
};

exports.getBlogBySlugPublished = async (slug) => {
  const [rows] = await db.query(SQL.GET_BLOG_BY_SLUG_PUBLISHED, [slug]);
  return rows[0] || null;
};

exports.createBlog = async (data, { userId } = {}) => {
  const id = data.id || uuidv4();
  const title = data.title;
  const content = data.content;

  if (!title) throw new Error("TITLE_REQUIRED");
  if (!content) throw new Error("CONTENT_REQUIRED");

  const baseSlug = slugify(data.slug || title);
  if (!baseSlug) throw new Error("SLUG_REQUIRED");
  const slug = await ensureUniqueSlug(baseSlug);

  const excerpt = data.excerpt ?? null;
  const cover_image_url = data.cover_image_url ?? null;
  const cover_image_alt = data.cover_image_alt ?? null;
  const category = data.category != null ? String(data.category).trim() || null : null;
  const status = data.status === "published" ? "published" : "draft";
  // Always use "now" (IST) when creating a published blog, ignore client-sent published_at
  const published_at =
    status === "published"
      ? toMySqlDatetimeIST(new Date())
      : null;

  const seo = toJsonOrNull(data.seo);
  const metadata = toJsonOrNull(data.metadata);
  const images = Array.isArray(data.images) ? data.images : [];

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(SQL.INSERT_BLOG, [
      id,
      slug,
      title,
      excerpt,
      content,
      cover_image_url,
      cover_image_alt,
      category,
      status,
      published_at,
      seo ?? null,
      metadata ?? null,
      userId ?? null
    ]);

    if (images.length) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i] || {};
        if (!img.image_url) continue;
        await connection.query(SQL.INSERT_BLOG_IMAGE, [
          uuidv4(),
          id,
          img.image_url,
          img.alt_text ?? null,
          Number.isFinite(img.position) ? img.position : i
        ]);
      }
    }

    await connection.commit();
    return { id, slug };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

exports.updateBlog = async (id, data) => {
  const existing = await getBlogById(id);
  if (!existing) return null;

  const merged = { ...existing, ...data };

  const title = merged.title;
  const content = merged.content;
  if (!title) throw new Error("TITLE_REQUIRED");
  if (!content) throw new Error("CONTENT_REQUIRED");

  let slug = slugify(merged.slug || merged.title);
  if (!slug) throw new Error("SLUG_REQUIRED");
  slug = await ensureUniqueSlug(slug, id);

  const excerpt = merged.excerpt ?? null;
  const cover_image_url = merged.cover_image_url ?? null;
  const cover_image_alt = merged.cover_image_alt ?? null;
  const category = merged.category != null ? String(merged.category).trim() || null : null;
  const status = merged.status === "published" ? "published" : "draft";

  // On update, if status is published, always set "now" (IST) as published_at.
  // If status is draft, clear published_at.
  const published_at =
    status === "published"
      ? toMySqlDatetimeIST(new Date())
      : null;

  const seo = toJsonOrNull(merged.seo);
  const metadata = toJsonOrNull(merged.metadata);

  const imagesProvided = data.images !== undefined;
  const images = Array.isArray(data.images) ? data.images : [];

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(SQL.UPDATE_BLOG, [
      slug,
      title,
      excerpt,
      content,
      cover_image_url,
      cover_image_alt,
      category,
      status,
      published_at,
      seo ?? null,
      metadata ?? null,
      id
    ]);

    if (imagesProvided) {
      await connection.query(SQL.DELETE_IMAGES_BY_BLOG_ID, [id]);
      for (let i = 0; i < images.length; i++) {
        const img = images[i] || {};
        if (!img.image_url) continue;
        await connection.query(SQL.INSERT_BLOG_IMAGE, [
          uuidv4(),
          id,
          img.image_url,
          img.alt_text ?? null,
          Number.isFinite(img.position) ? img.position : i
        ]);
      }
    }

    await connection.commit();
    return { id, slug };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

exports.deleteBlog = async (id) => {
  const [result] = await db.query(SQL.DELETE_BLOG_BY_ID, [id]);
  return result.affectedRows > 0;
};

exports.publishBlog = async (id) => {
  const existing = await getBlogById(id);
  if (!existing) return null;

  const updated = await exports.updateBlog(id, {
    status: "published",
    published_at: existing.published_at || new Date()
  });
  return updated;
};

exports.unpublishBlog = async (id) => {
  const existing = await getBlogById(id);
  if (!existing) return null;

  const updated = await exports.updateBlog(id, { status: "draft", published_at: null });
  return updated;
};

exports.listBlogsAdmin = async ({ status, q, page = 1, limit = 20 } = {}) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const offset = (safePage - 1) * safeLimit;

  const statusFilter = status ? String(status) : null;
  const query = q ? String(q) : null;
  const like = query ? `%${query}%` : null;

  const [rows] = await db.query(SQL.LIST_BLOGS_ADMIN, [
    statusFilter,
    statusFilter,
    query,
    like,
    like,
    safeLimit,
    offset
  ]);
  const [countRows] = await db.query(SQL.COUNT_BLOGS_ADMIN, [
    statusFilter,
    statusFilter,
    query,
    like,
    like
  ]);

  return {
    items: rows,
    page: safePage,
    limit: safeLimit,
    total: countRows?.[0]?.total || 0
  };
};

exports.listBlogsPublic = async ({ page = 1, limit = 10 } = {}) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const safePage = Math.max(Number(page) || 1, 1);
  const offset = (safePage - 1) * safeLimit;

  const [rows] = await db.query(SQL.LIST_BLOGS_PUBLIC, [safeLimit, offset]);
  const [countRows] = await db.query(SQL.COUNT_BLOGS_PUBLIC);

  return {
    items: rows,
    page: safePage,
    limit: safeLimit,
    total: countRows?.[0]?.total || 0
  };
};

