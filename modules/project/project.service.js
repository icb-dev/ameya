const db = require("../../config/db");
const SQL = require("./project.sql");
const sectionSQL = require("./projectSection.sql");

exports.createProject = async ({
  id,
  slug,
  project_name,
  sector,
  city,
  project_type,
  project_logo,
  project_thumbnail,
  status,
  featured = "no"
}) => {
  await db.query(SQL.INSERT_PROJECT, [
    id,
    slug,
    project_name,
    sector,
    city,
    project_type,
    project_logo,
    project_thumbnail,
    status,
    featured
  ]);
};

exports.getProjectBySlug = async (slug) => {
  const [rows] = await db.query(SQL.GET_PROJECT_BY_SLUG, [slug]);
  return rows[0];
};

exports.getAllProjects = async () => {
  const [rows] = await db.query(SQL.GET_ALL_PROJECTS);
  return rows;
};

exports.getFeaturedProjects = async () => {
  const [rows] = await db.query(SQL.GET_FEATURED_PROJECTS);
  return rows;
};



 
/**
 * 
 * Delete project and its sections in a transaction.
 * Deletes sections first, then the project. Throws NOT_FOUND if project doesn't exist.
 */
exports.deleteProject = async (id) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(sectionSQL.DELETE_SECTIONS_BY_PROJECT_ID, [id]);
    const [result] = await connection.query(SQL.DELETE_PROJECT_BY_ID, [id]);
    if (result.affectedRows === 0) {
      throw new Error("NOT_FOUND");
    }
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};



exports.getProjectById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM projects WHERE id = ?",
    [id]
  );
  return rows[0];
};

/**
 * Update project by id. Merges req.body with existing project so partial updates work.
 * Returns the updated project row count (1) or null if project not found.
 */
exports.updateProject = async (id, data) => {
  const existing = await exports.getProjectById(id);
  if (!existing) return null;

  const {
    slug,
    project_name,
    sector,
    city,
    project_type,
    project_logo,
    project_thumbnail,
    status,
    featured
  } = { ...existing, ...data };

  const [result] = await db.query(SQL.UPDATE_PROJECT, [
    slug,
    project_name,
    sector,
    city,
    project_type,
    project_logo ?? null,
    project_thumbnail ?? null,
    status,
    featured ?? "no",
    id
  ]);

  return result.affectedRows > 0 ? result : null;
};
