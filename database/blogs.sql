-- Blog Management Table
-- This table stores blog posts with comprehensive SEO features

CREATE TABLE IF NOT EXISTS `blogs` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL COMMENT 'Blog post title',
  `slug` VARCHAR(255) NOT NULL UNIQUE COMMENT 'URL-friendly slug (unique)',
  `content` LONGTEXT NOT NULL COMMENT 'Full blog content (HTML from CKEditor)',
  `excerpt` TEXT DEFAULT NULL COMMENT 'Short description/excerpt for listings',
  `featured_image` VARCHAR(500) DEFAULT NULL COMMENT 'Path to featured image',
  `featured_image_alt` VARCHAR(255) DEFAULT NULL COMMENT 'Alt text for featured image (SEO)',
  `meta_title` VARCHAR(60) DEFAULT NULL COMMENT 'SEO meta title (50-60 chars recommended)',
  `meta_description` VARCHAR(160) DEFAULT NULL COMMENT 'SEO meta description (150-160 chars recommended)',
  `meta_keywords` VARCHAR(500) DEFAULT NULL COMMENT 'Comma-separated meta keywords',
  `og_title` VARCHAR(255) DEFAULT NULL COMMENT 'Open Graph title for social media',
  `og_description` TEXT DEFAULT NULL COMMENT 'Open Graph description for social media',
  `og_image` VARCHAR(500) DEFAULT NULL COMMENT 'Open Graph image path',
  `og_image_alt` VARCHAR(255) DEFAULT NULL COMMENT 'Alt text for OG image',
  `schema_type` VARCHAR(50) DEFAULT 'Article' COMMENT 'Schema.org type (Article, BlogPosting, etc.)',
  `schema_json` LONGTEXT DEFAULT NULL COMMENT 'JSON-LD structured data (Schema.org)',
  `author` VARCHAR(100) DEFAULT NULL COMMENT 'Author name',
  `status` ENUM('draft', 'published') DEFAULT 'draft' COMMENT 'Publication status',
  `published_at` DATETIME DEFAULT NULL COMMENT 'Publication date and time',
  `category` VARCHAR(100) DEFAULT NULL COMMENT 'Blog category',
  `tags` VARCHAR(500) DEFAULT NULL COMMENT 'Comma-separated tags',
  `views` INT(11) DEFAULT 0 COMMENT 'Number of views/reads',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_slug` (`slug`),
  KEY `idx_status` (`status`),
  KEY `idx_published_at` (`published_at`),
  KEY `idx_category` (`category`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Blog posts with SEO optimization';

-- Indexes for better query performance
-- Status and published_at are commonly used for filtering published posts
-- Category index helps with category-based filtering
-- Created_at index helps with chronological sorting

-- Example insert (for reference):
/*
INSERT INTO `blogs` (
  `title`,
  `slug`,
  `content`,
  `excerpt`,
  `featured_image`,
  `featured_image_alt`,
  `meta_title`,
  `meta_description`,
  `meta_keywords`,
  `og_title`,
  `og_description`,
  `og_image`,
  `og_image_alt`,
  `schema_type`,
  `schema_json`,
  `author`,
  `status`,
  `published_at`,
  `category`,
  `tags`
) VALUES (
  'Welcome to Ameya Group Blog',
  'welcome-to-ameya-group-blog',
  '<h1>Welcome</h1><p>This is the blog content...</p>',
  'Welcome to our blog where we share insights about real estate.',
  '/uploads/blogs/featured-image.jpg',
  'Ameya Group office building',
  'Welcome to Ameya Group Blog | Real Estate Insights',
  'Discover the latest insights, news, and updates from Ameya Group, a leading real estate developer.',
  'real estate, ameya group, property, gurugram',
  'Welcome to Ameya Group Blog',
  'Discover the latest insights from Ameya Group',
  '/uploads/blogs/og-image.jpg',
  'Ameya Group Blog',
  'BlogPosting',
  '{"@context":"https://schema.org","@type":"BlogPosting","headline":"Welcome to Ameya Group Blog","description":"Discover the latest insights","author":{"@type":"Person","name":"Admin"},"datePublished":"2024-01-01T00:00:00Z"}',
  'Admin',
  'published',
  '2024-01-01 10:00:00',
  'Company News',
  'welcome, company, news'
);
*/

