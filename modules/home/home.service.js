const db = require("../../config/db");
const SQL = require("./home.sql");

exports.createHome = async ({ id, banner_image, title, large_title, button_url }) => {
  await db.query(SQL.INSERT_HOME, [id, banner_image, title, large_title, button_url]);
};

exports.getAllHome = async () => {
  const [rows] = await db.query(SQL.GET_ALL_HOME);
  return rows;
};

exports.getHomeById = async (id) => {
  const [rows] = await db.query(SQL.GET_HOME_BY_ID, [id]);
  return rows[0] || null;
};

exports.updateHome = async (id, data) => {
  const existing = await exports.getHomeById(id);
  if (!existing) return null;

  const {
    banner_image,
    title,
    large_title,
    button_url
  } = { ...existing, ...data };

  const [result] = await db.query(SQL.UPDATE_HOME, [
    banner_image,
    title,
    large_title,
    button_url,
    id
  ]);

  return result.affectedRows > 0 ? result : null;
};

exports.deleteHome = async (id) => {
  const [result] = await db.query(SQL.DELETE_HOME, [id]);
  return result.affectedRows > 0;
};

