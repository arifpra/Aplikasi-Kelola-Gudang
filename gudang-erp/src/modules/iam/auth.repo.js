const pool = require('../../config/db');

const normalizeArray = (rows, key) => rows.map((row) => row[key]).filter(Boolean);

async function findUserByEmail(email) {
  const { rows } = await pool.query(
    `
      SELECT id, name, email, password_hash, is_active
      FROM users
      WHERE lower(email) = lower($1)
      LIMIT 1
    `,
    [email],
  );

  return rows[0] || null;
}

async function findUserById(userId) {
  const { rows } = await pool.query(
    `
      SELECT id, name, email, is_active
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [userId],
  );

  return rows[0] || null;
}

async function findRolesByUserId(userId) {
  const { rows } = await pool.query(
    `
      SELECT DISTINCT r.code
      FROM roles r
      INNER JOIN user_roles ur ON ur.role_id = r.id
      WHERE ur.user_id = $1
      ORDER BY r.code ASC
    `,
    [userId],
  );

  return normalizeArray(rows, 'code');
}

async function findPermissionsByUserId(userId) {
  const { rows } = await pool.query(
    `
      SELECT DISTINCT p.code
      FROM permissions p
      INNER JOIN role_permissions rp ON rp.permission_id = p.id
      INNER JOIN user_roles ur ON ur.role_id = rp.role_id
      WHERE ur.user_id = $1
      ORDER BY p.code ASC
    `,
    [userId],
  );

  return normalizeArray(rows, 'code');
}

async function findUserWithAccessById(userId) {
  const user = await findUserById(userId);
  if (!user) return null;

  const [roles, permissions] = await Promise.all([
    findRolesByUserId(userId),
    findPermissionsByUserId(userId),
  ]);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isActive: user.is_active,
    roles,
    permissions,
  };
}

module.exports = {
  findUserByEmail,
  findUserWithAccessById,
};
