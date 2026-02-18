/**
 * Seed first admin user. Run: node scripts/seed-admin.js
 * Set ADMIN_USERNAME and ADMIN_PASSWORD in .env (or use defaults below for dev only).
 */
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");

const username = process.env.ADMIN_USERNAME || "admin";
const plainPassword = process.env.ADMIN_PASSWORD || "admin123";

async function seed() {
  const id = uuidv4();
  const password_hash = bcrypt.hashSync(plainPassword, 10);
  try {
    await db.query(
      "INSERT INTO admin_users (id, username, password_hash) VALUES (?, ?, ?)",
      [id, username, password_hash]
    );
    console.log("Admin user created:", username);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      console.log("Admin user already exists:", username);
    } else {
      throw err;
    }
  } finally {
    process.exit(0);
  }
}

seed();
