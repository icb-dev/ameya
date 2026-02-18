const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * Sanitize filename: remove path traversal and dangerous characters, but keep original name as-is.
 */
function sanitizeFilename(name) {
  if (!name) return "file";
  
  // Remove path separators and null bytes (security)
  let safe = String(name)
    .replace(/[\/\\\x00]/g, "") // remove /, \, null bytes
    .trim();
  
  // If empty after sanitization, use default
  if (!safe) return "file";
  
  // Limit length
  return safe.slice(0, 255);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads";
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    // Keep original filename, just sanitize dangerous chars (path traversal, null bytes)
    const originalName = file.originalname || "file";
    const sanitized = sanitizeFilename(originalName);
    
    // Use original name as-is (if file exists, it will overwrite)
    cb(null, sanitized);
  }
});

// No fileFilter: accept all file extensions
module.exports = multer({
  storage
});
