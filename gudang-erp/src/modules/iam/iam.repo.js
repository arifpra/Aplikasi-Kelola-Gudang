const pool = require('../../config/db');

async function listRoles() {
  const { rows } = await pool.query(
    `
      SELECT id, code, name
      FROM roles
      ORDER BY code ASC
    `,
  );

  return rows;
}

async function listPermissions() {
  const { rows } = await pool.query(
    `
      SELECT id, code, name
      FROM permissions
      ORDER BY code ASC
    `,
  );

  return rows;
}

module.exports = {
  listRoles,
  listPermissions,
};
