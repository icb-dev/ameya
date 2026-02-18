const express = require("express");
const router = express.Router();
const controller = require("./blogs.controller");

// Public endpoints
router.get("/", controller.listBlogsPublic);
router.get("/:slug", controller.getBlogPublic);

module.exports = router;

