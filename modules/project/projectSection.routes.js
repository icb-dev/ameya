const express = require("express");
const router = express.Router();
const controller = require("./projectSection.controller");

router.post("/sections", controller.addSection);
router.get("/:projectId/sections", controller.getSections);
router.patch("/sections/:id", controller.updateSection);
router.patch("/:projectId/sections/:id", controller.updateSectionForProject);
router.patch("/:projectId/sections/type/:sectionType", controller.updateSectionByType);

module.exports = router;
