const express = require("express");
const router = express.Router();
const controller = require("./about.controller");

// About main CRUD
router.get("/", controller.listAbout);
router.post("/", controller.createAbout);
router.get("/:id", controller.getAbout);
router.patch("/:id", controller.updateAbout);
router.delete("/:id", controller.deleteAbout);

// Logos for a given about entry
router.get("/:aboutId/logos", controller.listLogos);
router.post("/:aboutId/logos", controller.addLogo);

// Delete a specific logo
router.delete("/logos/:id", controller.deleteLogo);

module.exports = router;

