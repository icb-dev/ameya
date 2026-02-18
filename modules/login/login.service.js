const db = require("../../config/db");
const SQL = require("./login.sql");
const bcrypt = require("bcryptjs");

exports.getUserByUsername = async (username) => {
  const [rows] = await db.query(SQL.GET_USER_BY_USERNAME, [username]);
  return rows[0] || null;
};

exports.getUserById = async (id) => {
  const [rows] = await db.query(SQL.GET_USER_BY_ID, [id]);
  return rows[0] || null;
};

exports.verifyPassword = (plainPassword, passwordHash) => {
  return bcrypt.compareSync(plainPassword, passwordHash);
};

exports.updatePassword = async (id, newPlainPassword) => {
  const password_hash = bcrypt.hashSync(newPlainPassword, 10);
  const [result] = await db.query(SQL.UPDATE_PASSWORD, [password_hash, id]);
  return result.affectedRows > 0;
};
