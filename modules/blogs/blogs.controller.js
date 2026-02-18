const service = require("./blogs.service");

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function tryParseJson(v) {
  if (v === null || v === undefined) return v;
  if (typeof v !== "string") return v;
  const t = v.trim();
  if (!t) return null;
  try {
    return JSON.parse(t);
  } catch {
    return v;
  }
}

async function attachImages(blog) {
  if (!blog) return blog;
  const images = await service.getBlogImages(blog.id);
  return { ...blog, images };
}

function normalizeBlog(blog) {
  if (!blog) return blog;
  return {
    ...blog,
    seo: tryParseJson(blog.seo),
    metadata: tryParseJson(blog.metadata)
  };
}

// ============= ADMIN (protected) =============

exports.createBlog = async (req, res) => {
  try {
    const result = await service.createBlog(req.body, { userId: req.user?.id });
    res.status(201).json({ message: "Blog created", ...result });
  } catch (err) {
    if (err.message === "TITLE_REQUIRED") return res.status(400).json({ error: "Title is required" });
    if (err.message === "CONTENT_REQUIRED") return res.status(400).json({ error: "Content is required" });
    if (err.message === "SLUG_REQUIRED") return res.status(400).json({ error: "Slug/title is required" });
    if (err.message === "INVALID_PUBLISHED_AT") return res.status(400).json({ error: "Invalid published_at datetime" });
    if (err.name === "SyntaxError") return res.status(400).json({ error: "Invalid JSON in seo/metadata" });
    console.error(err);
    res.status(500).json({ error: "Failed to create blog" });
  }
};

exports.listBlogsAdmin = async (req, res) => {
  try {
    const { status, q, page, limit } = req.query;
    const result = await service.listBlogsAdmin({ status, q, page, limit });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list blogs" });
  }
};

exports.getBlogAdmin = async (req, res) => {
  const { id } = req.params;
  if (!UUID_REGEX.test(id)) return res.status(400).json({ error: "Invalid blog ID" });

  try {
    const blog = await service.getBlogById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    const withImages = await attachImages(normalizeBlog(blog));
    res.json(withImages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
};

exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  if (!UUID_REGEX.test(id)) return res.status(400).json({ error: "Invalid blog ID" });

  try {
    const updated = await service.updateBlog(id, req.body);
    if (!updated) return res.status(404).json({ error: "Blog not found" });
    res.json({ message: "Blog updated", ...updated });
  } catch (err) {
    if (err.message === "TITLE_REQUIRED") return res.status(400).json({ error: "Title is required" });
    if (err.message === "CONTENT_REQUIRED") return res.status(400).json({ error: "Content is required" });
    if (err.message === "SLUG_REQUIRED") return res.status(400).json({ error: "Slug/title is required" });
    if (err.message === "INVALID_PUBLISHED_AT") return res.status(400).json({ error: "Invalid published_at datetime" });
    if (err.name === "SyntaxError") return res.status(400).json({ error: "Invalid JSON in seo/metadata" });
    console.error(err);
    res.status(500).json({ error: "Failed to update blog" });
  }
};

exports.deleteBlog = async (req, res) => {
  const { id } = req.params;
  if (!UUID_REGEX.test(id)) return res.status(400).json({ error: "Invalid blog ID" });

  try {
    const ok = await service.deleteBlog(id);
    if (!ok) return res.status(404).json({ error: "Blog not found" });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete blog" });
  }
};

exports.publishBlog = async (req, res) => {
  const { id } = req.params;
  if (!UUID_REGEX.test(id)) return res.status(400).json({ error: "Invalid blog ID" });

  try {
    const updated = await service.publishBlog(id);
    if (!updated) return res.status(404).json({ error: "Blog not found" });
    res.json({ message: "Blog published", ...updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to publish blog" });
  }
};

exports.unpublishBlog = async (req, res) => {
  const { id } = req.params;
  if (!UUID_REGEX.test(id)) return res.status(400).json({ error: "Invalid blog ID" });

  try {
    const updated = await service.unpublishBlog(id);
    if (!updated) return res.status(404).json({ error: "Blog not found" });
    res.json({ message: "Blog set to draft", ...updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to unpublish blog" });
  }
};

// ============= PUBLIC (no auth) =============

exports.listBlogsPublic = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await service.listBlogsPublic({ page, limit });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list blogs" });
  }
};

exports.getBlogPublic = async (req, res) => {
  try {
    const blog = await service.getBlogBySlugPublished(req.params.slug);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const withImages = await attachImages(normalizeBlog(blog));
    res.json(withImages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
};

