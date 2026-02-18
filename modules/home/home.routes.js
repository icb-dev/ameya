const express = require("express");
const router = express.Router();
const controller = require("./home.controller");

// List all home entries
router.get("/", controller.listHome);

// Create home entry
router.post("/", controller.createHome);

// Get single home entry
router.get("/:id", controller.getHome);

// Update home entry
router.patch("/:id", controller.updateHome);

// Delete home entry
router.delete("/:id", controller.deleteHome);

module.exports = router;

