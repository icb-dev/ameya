module.exports = {
  INSERT_ABOUT: `
    INSERT INTO about (
      id,
      video_url,
      delivered_projects,
      ongoing_development,
      satisfied_customers,
      brand_partnerships
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `,

  GET_ALL_ABOUT: `
    SELECT
      id,
      video_url,
      delivered_projects,
      ongoing_development,
      satisfied_customers,
      brand_partnerships,
      created_at
    FROM about
    ORDER BY created_at DESC
  `,

  GET_ABOUT_BY_ID: `
    SELECT
      id,
      video_url,
      delivered_projects,
      ongoing_development,
      satisfied_customers,
      brand_partnerships,
      created_at
    FROM about
    WHERE id = ?
    LIMIT 1
  `,

  UPDATE_ABOUT: `
    UPDATE about
    SET
      video_url = ?,
      delivered_projects = ?,
      ongoing_development = ?,
      satisfied_customers = ?,
      brand_partnerships = ?
    WHERE id = ?
  `,

  DELETE_ABOUT: `
    DELETE FROM about
    WHERE id = ?
  `,

  INSERT_LOGO: `
    INSERT INTO about_logos (id, about_id, image_url, position)
    VALUES (?, ?, ?, ?)
  `,

  GET_LOGOS_BY_ABOUT: `
    SELECT id, about_id, image_url, position, created_at
    FROM about_logos
    WHERE about_id = ?
    ORDER BY position ASC, created_at ASC
  `,

  DELETE_LOGO: `
    DELETE FROM about_logos
    WHERE id = ?
  `
};

