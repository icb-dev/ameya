const express = require("express");
const router = express.Router();
const upload = require("../../middleware/upload");
const uploadAny = require("../../middleware/uploadAny");

// Wrapper to catch multer errors and return friendly messages
function uploadAnyHandler(req, res, next) {
  uploadAny.single("file")(req, res, (err) => {
    if (err) {
      if (err.name === "MulterError" || err.message?.includes("Field name")) {
        return res.status(400).json({ 
          error: "Field name must be exactly 'file'",
          hint: "In Postman: Body → form-data → key='file' (change type dropdown to 'File') → select your file",
          details: err.message || "MulterError: Field name missing"
        });
      }
      return next(err);
    }
    next();
  });
}

// Accept any file type, save to root uploads/ folder. Filename is slugified (e.g. testing-for-upload-123456.pdf).
// Must be before /:section routes so "any" is not captured as section.
router.post("/any", uploadAnyHandler, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      error: "No file uploaded. Use field name: 'file' (exactly) in form-data.",
      hint: "In Postman: Body → form-data → key='file' (type: File) → select your file"
    });
  }
  res.json({
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
});

// single image upload
router.post("/:section/single", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.params.section}/${req.file.filename}`
  });
});

// multiple image upload (gallery)
router.post("/:section/multiple", upload.array("images", 10), (req, res) => {
  const urls = req.files.map(
    (f) => `/uploads/${req.params.section}/${f.filename}`
  );

  res.json({ urls });
});

module.exports = router;
