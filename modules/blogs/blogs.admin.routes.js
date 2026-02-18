const express = require("express");
const router = express.Router();
const controller = require("./blogs.controller");
const { requireAuth } = require("../../middleware/auth");

// Admin endpoints (JWT required)
router.get("/", requireAuth, controller.listBlogsAdmin);
router.post("/", requireAuth, controller.createBlog);
router.get("/:id", requireAuth, controller.getBlogAdmin);
router.patch("/:id", requireAuth, controller.updateBlog);
router.delete("/:id", requireAuth, controller.deleteBlog);
router.post("/:id/publish", requireAuth, controller.publishBlog);
router.post("/:id/unpublish", requireAuth, controller.unpublishBlog);

module.exports = router;

