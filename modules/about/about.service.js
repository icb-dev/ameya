const db = require("../../config/db");
const SQL = require("./about.sql");

// ===== About main record =====

exports.createAbout = async ({
  id,
  video_url,
  delivered_projects,
  ongoing_development,
  satisfied_customers,
  brand_partnerships
}) => {
  await db.query(SQL.INSERT_ABOUT, [
    id,
    video_url,
    delivered_projects,
    ongoing_development,
    satisfied_customers,
    brand_partnerships
  ]);
};

exports.getAllAbout = async () => {
  const [rows] = await db.query(SQL.GET_ALL_ABOUT);
  return rows;
};

exports.getAboutById = async (id) => {
  const [rows] = await db.query(SQL.GET_ABOUT_BY_ID, [id]);
  return rows[0] || null;
};

exports.updateAbout = async (id, data) => {
  const existing = await exports.getAboutById(id);
  if (!existing) return null;

  const {
    video_url,
    delivered_projects,
    ongoing_development,
    satisfied_customers,
    brand_partnerships
  } = { ...existing, ...data };

  const [result] = await db.query(SQL.UPDATE_ABOUT, [
    video_url,
    delivered_projects,
    ongoing_development,
    satisfied_customers,
    brand_partnerships,
    id
  ]);

  return result.affectedRows > 0 ? result : null;
};

exports.deleteAbout = async (id) => {
  const [result] = await db.query(SQL.DELETE_ABOUT, [id]);
  return result.affectedRows > 0;
};

// ===== About logos (dynamic list) =====

exports.addLogo = async ({ id, about_id, image_url, position }) => {
  await db.query(SQL.INSERT_LOGO, [id, about_id, image_url, position]);
};

exports.getLogosByAbout = async (about_id) => {
  const [rows] = await db.query(SQL.GET_LOGOS_BY_ABOUT, [about_id]);
  return rows;
};

exports.deleteLogo = async (id) => {
  const [result] = await db.query(SQL.DELETE_LOGO, [id]);
  return result.affectedRows > 0;
};

