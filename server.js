require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./config/db");

// ================== MIDDLEWARE ==================
app.use(cors());
app.use(express.json());

// ================== STATIC FILES ==================
// 🔥 THIS MUST BE BEFORE ROUTES
app.use("/uploads", express.static("uploads"));

// ================== ROUTES ==================

// upload routes (images, media)
const uploadRoutes = require("./modules/upload/upload.routes");
app.use("/api/upload", uploadRoutes);

// login (no auth required for POST /api/login)
const loginRoutes = require("./modules/login/login.routes");
app.use("/api/login", loginRoutes);

// home routes
const homeRoutes = require("./modules/home/home.routes");
app.use("/api/home", homeRoutes);

// about routes
const aboutRoutes = require("./modules/about/about.routes");
app.use("/api/about", aboutRoutes);

// project routes
const projectRoutes = require("./modules/project/project.routes");
const projectSectionRoutes = require("./modules/project/projectSection.routes");

app.use("/api/projects", projectRoutes);
app.use("/api/projects", projectSectionRoutes);

// blogs routes
const blogPublicRoutes = require("./modules/blogs/blogs.routes");
const blogAdminRoutes = require("./modules/blogs/blogs.admin.routes");
app.use("/api/blogs", blogPublicRoutes);
app.use("/api/admin/blogs", blogAdminRoutes);

// ================== TEST ROUTE ==================
app.get("/", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.send("Database connected ✅");
  } catch (err) {
    res.status(500).send("Database error");
  }
});

// ================== SERVER ==================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
