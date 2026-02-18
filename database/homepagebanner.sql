-- MySQL Database Schema for Homepage Banner
-- This schema stores banner images with links for the homepage carousel

-- Homepage Banner Table
CREATE TABLE IF NOT EXISTS `homepage_banners` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `image` VARCHAR(255) NOT NULL COMMENT 'Path to banner image',
  `link` VARCHAR(500) DEFAULT NULL COMMENT 'URL link for the banner (optional)',
  `display_order` INT UNSIGNED DEFAULT 0 COMMENT 'Order for displaying banners in carousel (lower number = shown first)',
  `is_active` TINYINT(1) DEFAULT 1 COMMENT 'Whether the banner is active (1 = active, 0 = inactive)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  INDEX `idx_display_order` (`display_order`),
  INDEX `idx_is_active` (`is_active`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Homepage banner images with links for carousel';

-- Example Insert Query (for reference)
/*
INSERT INTO `homepage_banners` (image, link, display_order, is_active) VALUES
('uploads/banners/banner01.jpg', 'https://example.com/property1', 1, 1),
('uploads/banners/banner02.jpg', 'https://example.com/property2', 2, 1),
('uploads/banners/banner03.jpg', 'https://example.com/property3', 3, 1);
*/

-- Example Select Query (for fetching active banners ordered by display_order)
/*
SELECT * FROM `homepage_banners` 
WHERE is_active = 1 
ORDER BY display_order ASC, created_at ASC;
*/

-- Example Update Query (for updating banner details)
/*
UPDATE `homepage_banners` 
SET image = 'uploads/banners/new-banner.jpg', 
    link = 'https://example.com/new-link',
    display_order = 1,
    is_active = 1
WHERE id = ?;
*/

-- Example Delete Query (soft delete by setting is_active to 0)
/*
UPDATE `homepage_banners` SET is_active = 0 WHERE id = ?;
*/

-- Example Hard Delete Query
/*
DELETE FROM `homepage_banners` WHERE id = ?;
*/

