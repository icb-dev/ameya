-- MySQL Database Schema for Residential Properties
-- This schema stores all data for residential property listings

-- Main Residential Properties Table
CREATE TABLE IF NOT EXISTS `residential_properties` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Banner Section
  `banner_background` VARCHAR(255) DEFAULT NULL COMMENT 'Path to banner background image',
  `banner_title` VARCHAR(255) DEFAULT NULL COMMENT 'Banner title text',
  `banner_location` VARCHAR(255) DEFAULT NULL COMMENT 'Banner location text',
  
  -- Address Section
  `address_title` VARCHAR(255) DEFAULT NULL COMMENT 'Address section title',
  `address_img` VARCHAR(255) DEFAULT NULL COMMENT 'Path to address image',
  
  -- Basic Amenities Section
  `basic_amenities_text` TEXT DEFAULT NULL COMMENT 'Basic amenities description text',
  `basic_amenities_img` VARCHAR(255) DEFAULT NULL COMMENT 'Path to basic amenities image',
  
  -- Club Section
  `club_title` VARCHAR(255) DEFAULT NULL COMMENT 'Club section title',
  `club_description` TEXT DEFAULT NULL COMMENT 'Club section description',
  `club_img` VARCHAR(255) DEFAULT NULL COMMENT 'Path to club image',
  
  -- Cafe Section
  `cafe_title` VARCHAR(255) DEFAULT NULL COMMENT 'Cafe section title',
  `cafe_img` VARCHAR(255) DEFAULT NULL COMMENT 'Path to cafe image',
  
  -- Feature Section
  `feature_img1` VARCHAR(255) DEFAULT NULL COMMENT 'Path to feature image 1',
  `feature_text1` VARCHAR(500) DEFAULT NULL COMMENT 'Feature text 1',
  `feature_img2` VARCHAR(255) DEFAULT NULL COMMENT 'Path to feature image 2',
  `feature_text2` VARCHAR(500) DEFAULT NULL COMMENT 'Feature text 2',
  
  -- Greenhub Section
  `greenhub_bg_img` VARCHAR(255) DEFAULT NULL COMMENT 'Path to greenhub background image',
  `greenhub_title` VARCHAR(255) DEFAULT NULL COMMENT 'Greenhub section title',
  `greenhub_description` TEXT DEFAULT NULL COMMENT 'Greenhub section description',
  
  -- Residences Section
  `residences_title` VARCHAR(255) DEFAULT NULL COMMENT 'Residences section title',
  `residences_description` TEXT DEFAULT NULL COMMENT 'Residences section description',
  `residences_img` VARCHAR(255) DEFAULT NULL COMMENT 'Path to residences image',
  
  -- Living Room Section
  `living_room_bg_img` VARCHAR(255) DEFAULT NULL COMMENT 'Path to living room background image',
  `living_room_title` VARCHAR(255) DEFAULT NULL COMMENT 'Living room section title',
  `living_room_description` TEXT DEFAULT NULL COMMENT 'Living room section description',
  
  -- Location Section
  `location_title` VARCHAR(255) DEFAULT NULL COMMENT 'Location section title',
  `location_description` TEXT DEFAULT NULL COMMENT 'Location section description',
  `location_img` VARCHAR(255) DEFAULT NULL COMMENT 'Path to location image',
  
  -- Nearby Section
  `near_by_title` VARCHAR(255) DEFAULT NULL COMMENT 'Nearby section title',
  
  PRIMARY KEY (`id`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_updated_at` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Main table for residential property listings';

-- Address Features Table (Array field)
CREATE TABLE IF NOT EXISTS `residential_address_features` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `residential_property_id` INT UNSIGNED NOT NULL,
  `feature_text` VARCHAR(500) NOT NULL,
  `display_order` INT UNSIGNED DEFAULT 0 COMMENT 'Order for displaying features',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  FOREIGN KEY (`residential_property_id`) 
    REFERENCES `residential_properties`(`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  INDEX `idx_property_id` (`residential_property_id`),
  INDEX `idx_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Address features for residential properties';

-- Club Features Table (Array field)
CREATE TABLE IF NOT EXISTS `residential_club_features` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `residential_property_id` INT UNSIGNED NOT NULL,
  `feature_text` VARCHAR(500) NOT NULL,
  `display_order` INT UNSIGNED DEFAULT 0 COMMENT 'Order for displaying features',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  FOREIGN KEY (`residential_property_id`) 
    REFERENCES `residential_properties`(`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  INDEX `idx_property_id` (`residential_property_id`),
  INDEX `idx_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Club features for residential properties';

-- Residences Features Table (Array field)
CREATE TABLE IF NOT EXISTS `residential_residences_features` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `residential_property_id` INT UNSIGNED NOT NULL,
  `feature_text` VARCHAR(500) NOT NULL,
  `display_order` INT UNSIGNED DEFAULT 0 COMMENT 'Order for displaying features',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  FOREIGN KEY (`residential_property_id`) 
    REFERENCES `residential_properties`(`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  INDEX `idx_property_id` (`residential_property_id`),
  INDEX `idx_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Residences features for residential properties';

-- Plans Table (Array field - name + image)
CREATE TABLE IF NOT EXISTS `residential_plans` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `residential_property_id` INT UNSIGNED NOT NULL,
  `plan_name` VARCHAR(255) NOT NULL,
  `plan_img` VARCHAR(255) DEFAULT NULL COMMENT 'Path to plan image',
  `display_order` INT UNSIGNED DEFAULT 0 COMMENT 'Order for displaying plans',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  FOREIGN KEY (`residential_property_id`) 
    REFERENCES `residential_properties`(`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  INDEX `idx_property_id` (`residential_property_id`),
  INDEX `idx_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Plans for residential properties (name + image pairs)';

-- Nearby Time Table (Array field)
CREATE TABLE IF NOT EXISTS `residential_nearby_time` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `residential_property_id` INT UNSIGNED NOT NULL,
  `time_text` VARCHAR(255) NOT NULL COMMENT 'Time text (e.g., "5 mins", "10 mins")',
  `display_order` INT UNSIGNED DEFAULT 0 COMMENT 'Order for displaying items',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  FOREIGN KEY (`residential_property_id`) 
    REFERENCES `residential_properties`(`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  INDEX `idx_property_id` (`residential_property_id`),
  INDEX `idx_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Nearby time information for residential properties';

-- Nearby Location Table (Array field)
CREATE TABLE IF NOT EXISTS `residential_nearby_location` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `residential_property_id` INT UNSIGNED NOT NULL,
  `location_text` VARCHAR(255) NOT NULL COMMENT 'Location name',
  `display_order` INT UNSIGNED DEFAULT 0 COMMENT 'Order for displaying items',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  FOREIGN KEY (`residential_property_id`) 
    REFERENCES `residential_properties`(`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  INDEX `idx_property_id` (`residential_property_id`),
  INDEX `idx_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Nearby location information for residential properties';

-- Nearby Table (Array field)
CREATE TABLE IF NOT EXISTS `residential_nearby` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `residential_property_id` INT UNSIGNED NOT NULL,
  `nearby_text` VARCHAR(255) NOT NULL COMMENT 'Nearby item description',
  `display_order` INT UNSIGNED DEFAULT 0 COMMENT 'Order for displaying items',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  FOREIGN KEY (`residential_property_id`) 
    REFERENCES `residential_properties`(`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  INDEX `idx_property_id` (`residential_property_id`),
  INDEX `idx_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='General nearby information for residential properties';

-- Example Insert Query Structure (for reference)
/*
-- Insert main residential property
INSERT INTO `residential_properties` (
  banner_background, banner_title, banner_location,
  address_title, address_img,
  basic_amenities_text, basic_amenities_img,
  club_title, club_description, club_img,
  cafe_title, cafe_img,
  feature_img1, feature_text1, feature_img2, feature_text2,
  greenhub_bg_img, greenhub_title, greenhub_description,
  residences_title, residences_description, residences_img,
  living_room_bg_img, living_room_title, living_room_description,
  location_title, location_description, location_img,
  near_by_title
) VALUES (
  'uploads/banner-bg.jpg', 'Luxury Residences', 'Gurugram',
  'Premium Address', 'uploads/address.jpg',
  'World-class amenities', 'uploads/amenities.jpg',
  'Club House', 'Exclusive club facilities', 'uploads/club.jpg',
  'Cafe & Restaurant', 'uploads/cafe.jpg',
  'uploads/feature1.jpg', 'Feature description 1', 'uploads/feature2.jpg', 'Feature description 2',
  'uploads/greenhub-bg.jpg', 'Green Hub', 'Sustainable living',
  'Residences', 'Premium residences description', 'uploads/residences.jpg',
  'uploads/living-room-bg.jpg', 'Living Room', 'Spacious living areas',
  'Location', 'Prime location description', 'uploads/location.jpg',
  'Nearby Attractions'
);

-- Get the last inserted ID
SET @property_id = LAST_INSERT_ID();

-- Insert address features
INSERT INTO `residential_address_features` (residential_property_id, feature_text, display_order) VALUES
(@property_id, 'Feature 1', 1),
(@property_id, 'Feature 2', 2);

-- Insert club features
INSERT INTO `residential_club_features` (residential_property_id, feature_text, display_order) VALUES
(@property_id, 'Club Feature 1', 1),
(@property_id, 'Club Feature 2', 2);

-- Insert residences features
INSERT INTO `residential_residences_features` (residential_property_id, feature_text, display_order) VALUES
(@property_id, 'Residence Feature 1', 1),
(@property_id, 'Residence Feature 2', 2);

-- Insert plans
INSERT INTO `residential_plans` (residential_property_id, plan_name, plan_img, display_order) VALUES
(@property_id, '2 BHK', 'uploads/plan-2bhk.jpg', 1),
(@property_id, '3 BHK', 'uploads/plan-3bhk.jpg', 2);

-- Insert nearby time
INSERT INTO `residential_nearby_time` (residential_property_id, time_text, display_order) VALUES
(@property_id, '5 mins', 1),
(@property_id, '10 mins', 2);

-- Insert nearby location
INSERT INTO `residential_nearby_location` (residential_property_id, location_text, display_order) VALUES
(@property_id, 'Shopping Mall', 1),
(@property_id, 'Hospital', 2);

-- Insert nearby
INSERT INTO `residential_nearby` (residential_property_id, nearby_text, display_order) VALUES
(@property_id, 'Nearby Item 1', 1),
(@property_id, 'Nearby Item 2', 2);
*/

-- Example Select Query with JOINs (for fetching complete property data)
/*
SELECT 
  rp.*,
  GROUP_CONCAT(DISTINCT af.feature_text ORDER BY af.display_order SEPARATOR '|||') as address_features,
  GROUP_CONCAT(DISTINCT cf.feature_text ORDER BY cf.display_order SEPARATOR '|||') as club_features,
  GROUP_CONCAT(DISTINCT rf.feature_text ORDER BY rf.display_order SEPARATOR '|||') as residences_features,
  GROUP_CONCAT(DISTINCT CONCAT(p.plan_name, ':::', p.plan_img) ORDER BY p.display_order SEPARATOR '|||') as plans,
  GROUP_CONCAT(DISTINCT nt.time_text ORDER BY nt.display_order SEPARATOR '|||') as nearby_time,
  GROUP_CONCAT(DISTINCT nl.location_text ORDER BY nl.display_order SEPARATOR '|||') as nearby_location,
  GROUP_CONCAT(DISTINCT n.nearby_text ORDER BY n.display_order SEPARATOR '|||') as nearby
FROM residential_properties rp
LEFT JOIN residential_address_features af ON rp.id = af.residential_property_id
LEFT JOIN residential_club_features cf ON rp.id = cf.residential_property_id
LEFT JOIN residential_residences_features rf ON rp.id = rf.residential_property_id
LEFT JOIN residential_plans p ON rp.id = p.residential_property_id
LEFT JOIN residential_nearby_time nt ON rp.id = nt.residential_property_id
LEFT JOIN residential_nearby_location nl ON rp.id = nl.residential_property_id
LEFT JOIN residential_nearby n ON rp.id = n.residential_property_id
WHERE rp.id = ?
GROUP BY rp.id;
*/

