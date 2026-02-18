module.exports = {
  INSERT_BLOG: `
    INSERT INTO blogs (
      id, slug, title, excerpt, content,
      cover_image_url, cover_image_alt, category,
      status, published_at,
      seo, metadata,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  UPDATE_BLOG: `
    UPDATE blogs
    SET slug = ?,
        title = ?,
        excerpt = ?,
        content = ?,
        cover_image_url = ?,
        cover_image_alt = ?,
        category = ?,
        status = ?,
        published_at = ?,
        seo = ?,
        metadata = ?
    WHERE id = ?
  `,

  DELETE_BLOG_BY_ID: `
    DELETE FROM blogs WHERE id = ?
  `,

  GET_BLOG_BY_ID: `
    SELECT *
    FROM blogs
    WHERE id = ?
    LIMIT 1
  `,

  GET_BLOG_BY_SLUG_ANY: `
    SELECT *
    FROM blogs
    WHERE slug = ?
    LIMIT 1
  `,

  GET_BLOG_BY_SLUG_PUBLISHED: `
    SELECT *
    FROM blogs
    WHERE slug = ?
      AND status = 'published'
    LIMIT 1
  `,

  LIST_BLOGS_ADMIN: `
    SELECT id, slug, title, category, status, published_at, created_at, updated_at
    FROM blogs
    WHERE (? IS NULL OR status = ?)
      AND (? IS NULL OR title LIKE ? OR slug LIKE ?)
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `,

  COUNT_BLOGS_ADMIN: `
    SELECT COUNT(*) AS total
    FROM blogs
    WHERE (? IS NULL OR status = ?)
      AND (? IS NULL OR title LIKE ? OR slug LIKE ?)
  `,

  LIST_BLOGS_PUBLIC: `
    SELECT id, slug, title, excerpt, cover_image_url, cover_image_alt, category, published_at, created_at
    FROM blogs
    WHERE status = 'published'
    ORDER BY published_at DESC, created_at DESC
    LIMIT ? OFFSET ?
  `,

  COUNT_BLOGS_PUBLIC: `
    SELECT COUNT(*) AS total
    FROM blogs
    WHERE status = 'published'
  `,

  COUNT_SLUG_EXISTS: `
    SELECT COUNT(*) AS total
    FROM blogs
    WHERE slug = ?
      AND id <> ?
  `,

  INSERT_BLOG_IMAGE: `
    INSERT INTO blog_images (id, blog_id, image_url, alt_text, position)
    VALUES (?, ?, ?, ?, ?)
  `,

  DELETE_IMAGES_BY_BLOG_ID: `
    DELETE FROM blog_images WHERE blog_id = ?
  `,

  GET_IMAGES_BY_BLOG_ID: `
    SELECT id, blog_id, image_url, alt_text, position, created_at
    FROM blog_images
    WHERE blog_id = ?
    ORDER BY position ASC, created_at ASC
  `
};

