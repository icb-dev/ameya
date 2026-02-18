module.exports = {
  INSERT_HOME: `
    INSERT INTO home (id, banner_image, title, large_title, button_url)
    VALUES (?, ?, ?, ?, ?)
  `,

  GET_ALL_HOME: `
    SELECT id, banner_image, title, large_title, button_url, created_at
    FROM home
    ORDER BY created_at DESC
  `,

  GET_HOME_BY_ID: `
    SELECT id, banner_image, title, large_title, button_url, created_at
    FROM home
    WHERE id = ?
    LIMIT 1
  `,

  UPDATE_HOME: `
    UPDATE home
    SET banner_image = ?, title = ?, large_title = ?, button_url = ?
    WHERE id = ?
  `,

  DELETE_HOME: `
    DELETE FROM home
    WHERE id = ?
  `
};

