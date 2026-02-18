-- Keywords Management Table
-- This table stores keywords with their redirection URLs

CREATE TABLE IF NOT EXISTS `keywords` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `keyword` VARCHAR(255) NOT NULL COMMENT 'The keyword/phrase to match',
  `redirect_url` VARCHAR(500) DEFAULT NULL COMMENT 'URL to redirect to (can be full URL or relative path, optional)',
  `clicks` INT(11) DEFAULT 0 COMMENT 'Number of times this keyword was clicked/redirected',
  `is_active` TINYINT(1) DEFAULT 1 COMMENT 'Whether the keyword is active (1) or inactive (0)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_keyword` (`keyword`),
  KEY `idx_keyword` (`keyword`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Keywords with redirection URLs';

-- Indexes explanation:
-- unique_keyword: Ensures no duplicate keywords
-- idx_keyword: Fast lookup by keyword (for search/redirect functionality)
-- idx_is_active: Filter active/inactive keywords quickly
-- idx_created_at: Sort by creation date

-- Example inserts (for reference):
/*
INSERT INTO `keywords` (`keyword`, `redirect_url`, `is_active`) VALUES
('real estate', 'https://example.com/properties', 1),
('gurugram properties', '/properties/gurugram', 1),
('commercial space', '/properties/commercial', 1),
('residential', '/properties/residential', 1);

-- Update clicks when keyword is used
UPDATE `keywords` SET `clicks` = `clicks` + 1 WHERE `keyword` = 'real estate';

-- Deactivate a keyword
UPDATE `keywords` SET `is_active` = 0 WHERE `id` = 1;
*/

