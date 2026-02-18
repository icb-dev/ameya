const db = require("../../config/db");
const SQL = require("./projectSection.sql");

exports.createSection = async ({
  id,
  project_id,
  section_type,
  position,
  data
}) => {
  await db.query(SQL.INSERT_SECTION, [
    id,
    project_id,
    section_type,
    position,
    JSON.stringify(data)
  ]);
};

exports.getSectionsByProject = async (project_id) => {
  const [rows] = await db.query(
    SQL.GET_SECTIONS_BY_PROJECT,
    [project_id]
  );

  return rows;
};

exports.getSectionById = async (id) => {
  const [rows] = await db.query(SQL.GET_SECTION_BY_ID, [id]);
  return rows[0] || null;
};

/**
 * Update section by section id.
 * - Merges provided fields with existing row.
 * - If body is raw section data (no data/position/section_type keys),
 *   it is treated as the new `data` object.
 */
exports.updateSection = async (id, patch) => {
  const existing = await exports.getSectionById(id);
  if (!existing) return null;

  // If frontend sends pure section data (e.g. { heading, description, image }),
  // wrap it under `data` so it updates correctly.
  let normalizedPatch = patch;
  if (
    patch &&
    !Object.prototype.hasOwnProperty.call(patch, "data") &&
    !Object.prototype.hasOwnProperty.call(patch, "position") &&
    !Object.prototype.hasOwnProperty.call(patch, "section_type")
  ) {
    normalizedPatch = { data: patch };
  }

  const merged = { ...existing, ...normalizedPatch };

  const section_type = merged.section_type;
  const position = merged.position;
  const data =
    typeof merged.data === "string" ? merged.data : JSON.stringify(merged.data);

  const [result] = await db.query(SQL.UPDATE_SECTION, [
    section_type,
    position,
    data,
    id
  ]);

  return result.affectedRows > 0 ? result : null;
};
