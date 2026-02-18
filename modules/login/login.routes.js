const express = require("express");
const router = express.Router();
const controller = require("./login.controller");
const { requireAuth } = require("../../middleware/auth");

router.post("/", controller.login);
router.get("/me", requireAuth, controller.me);
router.put("/password", requireAuth, controller.changePassword);

module.exports = router;
