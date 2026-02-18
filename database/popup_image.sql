-- MySQL Database Schema for Popup Image
-- This schema stores the popup contact form image displayed on the homepage

-- Popup Image Table
CREATE TABLE IF NOT EXISTS `popup_image` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `image` VARCHAR(255) NOT NULL COMMENT 'Path to popup image',
  `is_active` TINYINT(1) DEFAULT 1 COMMENT 'Whether the popup image is active (1 = active, 0 = inactive)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  INDEX `idx_is_active` (`is_active`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Popup contact form image for homepage';

-- Example Insert Query (for reference)
/*
INSERT INTO `popup_image` (image, is_active) VALUES
('uploads/popup/contact.jpg', 1);
*/

-- Example Select Query (for fetching active popup image)
/*
SELECT * FROM `popup_image` 
WHERE is_active = 1 
ORDER BY created_at DESC 
LIMIT 1;
*/

-- Example Update Query (for updating popup image)
/*
UPDATE `popup_image` 
SET image = 'uploads/popup/new-contact.jpg', 
    is_active = 1
WHERE id = ?;
*/

-- Example Delete Query (soft delete by setting is_active to 0)
/*
UPDATE `popup_image` SET is_active = 0 WHERE id = ?;
*/

-- Example Hard Delete Query
/*
DELETE FROM `popup_image` WHERE id = ?;
*/

