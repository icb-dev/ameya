module.exports = {
  GET_USER_BY_USERNAME: `
    SELECT id, username, password_hash
    FROM admin_users
    WHERE username = ?
    LIMIT 1
  `,
  GET_USER_BY_ID: `
    SELECT id, username, password_hash
    FROM admin_users
    WHERE id = ?
    LIMIT 1
  `,
  UPDATE_PASSWORD: `
    UPDATE admin_users
    SET password_hash = ?
    WHERE id = ?
  `
};
