module.exports = {
    INSERT_SECTION: `
      INSERT INTO project_sections
      (id, project_id, section_type, position, data)
      VALUES (?, ?, ?, ?, ?)
    `,
  
    GET_SECTIONS_BY_PROJECT: `
      SELECT id, section_type, position, data
      FROM project_sections
      WHERE project_id = ?
      ORDER BY position ASC
    `,

    GET_SECTION_BY_ID: `
      SELECT id, project_id, section_type, position, data
      FROM project_sections
      WHERE id = ?
      LIMIT 1
    `,

    DELETE_SECTIONS_BY_PROJECT_ID: `
      DELETE FROM project_sections WHERE project_id = ?
    `,

    UPDATE_SECTION: `
      UPDATE project_sections
      SET section_type = ?, position = ?, data = ?
      WHERE id = ?
    `
  };
  