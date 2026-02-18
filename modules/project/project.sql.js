module.exports = {
  INSERT_PROJECT: `
    INSERT INTO projects (id, slug, project_name, sector, city, project_type, project_logo, project_thumbnail, status, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  GET_PROJECT_BY_SLUG: `
    SELECT p.*, s.data AS overview
    FROM projects p
    LEFT JOIN project_sections s
      ON s.project_id = p.id AND s.section_type = 'overview'
    WHERE p.slug = ?
  `,

  GET_ALL_PROJECTS: `
    SELECT p.id,
           p.slug,
           p.project_name,
           p.sector,
           p.city,
           p.project_type,
           p.project_logo,
           p.project_thumbnail,
           p.status,
           p.featured,
           p.created_at,
           s.data AS overview
    FROM projects p
    LEFT JOIN project_sections s
      ON s.project_id = p.id AND s.section_type = 'overview'
    ORDER BY p.created_at DESC
  `,

  GET_FEATURED_PROJECTS: `
    SELECT p.id,
           p.slug,
           p.project_name,
           p.sector,
           p.city,
           p.project_type,
           p.project_logo,
           p.project_thumbnail,
           p.status,
           p.featured,
           p.created_at,
           s.data AS overview
    FROM projects p
    LEFT JOIN project_sections s
      ON s.project_id = p.id AND s.section_type = 'overview'
    WHERE p.featured = 'yes'
    ORDER BY p.created_at DESC
  `,

  DELETE_PROJECT_BY_ID: `
    DELETE FROM projects WHERE id = ?
  `,

  UPDATE_PROJECT: `
    UPDATE projects
    SET slug = ?, project_name = ?, sector = ?, city = ?, project_type = ?,
        project_logo = ?, project_thumbnail = ?, status = ?, featured = ?
    WHERE id = ?
  `
};
// done
