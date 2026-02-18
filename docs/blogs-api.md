# Blogs API (Public + Admin CMS)

## Base mounts (recommended)

- **Public**: `/api/blogs`
- **Admin**: `/api/admin/blogs` (**requires JWT** via `Authorization: Bearer <token>`)

### Express mount example

```js
// server.js (or app.js)
app.use("/api/blogs", require("./modules/blogs/blogs.public.routes"));
app.use("/api/admin/blogs", require("./modules/blogs/blogs.admin.routes"));
```

## Endpoint table

| Type | Method | Endpoint | Auth | Purpose |
|------|--------|----------|------|---------|
| Public | GET | `/api/blogs?page=&limit=` | No | List published blogs (paginated) |
| Public | GET | `/api/blogs/:slug` | No | Get published blog by slug (returns blog + `images[]`, `seo`, `metadata`) |
| Admin | GET | `/api/admin/blogs?status=&q=&page=&limit=` | Yes | List blogs (draft/published), search by title/slug |
| Admin | POST | `/api/admin/blogs` | Yes | Create blog |
| Admin | GET | `/api/admin/blogs/:id` | Yes | Get blog by id (includes `images[]`) |
| Admin | PATCH | `/api/admin/blogs/:id` | Yes | Update blog (partial update supported; if you include `images`, it replaces all images) |
| Admin | DELETE | `/api/admin/blogs/:id` | Yes | Delete blog |
| Admin | POST | `/api/admin/blogs/:id/publish` | Yes | Publish blog (sets `status=published`, sets `published_at` if missing) |
| Admin | POST | `/api/admin/blogs/:id/unpublish` | Yes | Unpublish blog (sets `status=draft`, clears `published_at`) |

## Admin create/update body (shape)

Send JSON like:

### Core

- `title` (required)
- `content` (required) (recommended: HTML string from rich text editor)
- `slug` (optional; unique)
- `excerpt` (optional)
- `status` (optional: `draft` \| `published`)
- `published_at` (optional; ISO string or `null`)

### Cover image

- `cover_image_url` (optional)
- `cover_image_alt` (optional)

### SEO (JSON)

`seo` object (optional):

- `metaTitle`
- `metaDescription`
- `metaKeywords`
- `canonicalUrl`
- `robots`
- `og`: `{ title, description, imageUrl, imageAlt }`
- `twitter`: `{ title, description, imageUrl, imageAlt }`
- `schemaJsonLd`: any JSON-LD object/array

### Metadata (JSON)

`metadata` is optional and free-form:

- Recommended as an object: `{ "key": "value", "anotherKey": 123 }`
- Or a list: `[{ "key": "foo", "value": "bar" }]` if your UI uses add/remove rows.

### Inline images with alt (optional)

`images` array (optional):

```json
[
  { "image_url": "/uploads/blogs/abc.jpg", "alt_text": "Lobby view", "position": 0 },
  { "image_url": "/uploads/blogs/def.jpg", "alt_text": "Amenities", "position": 1 }
]
```

## DB structure (MySQL)

```sql
-- =========================
-- Blogs (CMS) tables
-- =========================
-- Stores blog posts with SEO + metadata + JSON-LD schema support.
CREATE TABLE blogs (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content LONGTEXT NOT NULL,
  cover_image_url VARCHAR(255),
  cover_image_alt VARCHAR(255),
  status ENUM('draft', 'published') DEFAULT 'draft',
  published_at DATETIME NULL,
  -- SEO object (JSON): metaTitle, metaDescription, metaKeywords, canonicalUrl, robots,
  -- og: {title, description, imageUrl, imageAlt}, twitter: {title, description, imageUrl, imageAlt},
  -- schemaJsonLd: any JSON-LD object/array.
  seo JSON NULL,
  -- Free-form metadata for add/remove fields in admin (JSON object or array of {key,value}).
  metadata JSON NULL,
  created_by CHAR(36) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL
);

-- Optional: store images used in a blog with dedicated alt text.
CREATE TABLE blog_images (
  id CHAR(36) PRIMARY KEY,
  blog_id CHAR(36) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  alt_text VARCHAR(255),
  position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE
);
```

