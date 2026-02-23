const pool = require('../../config/db');

function buildUpdateClause(payload, startIndex = 1) {
  const entries = Object.entries(payload).filter(([, value]) => typeof value !== 'undefined');
  const sets = [];
  const values = [];

  entries.forEach(([key, value], index) => {
    sets.push(`${key} = $${startIndex + index}`);
    values.push(value);
  });

  return { sets, values };
}

async function listWarehouses({ q, limit, offset, isActive }) {
  const conditions = [];
  const values = [];

  if (q) {
    values.push(`%${q}%`);
    conditions.push(`(code ILIKE $${values.length} OR name ILIKE $${values.length})`);
  }

  if (typeof isActive === 'boolean') {
    values.push(isActive);
    conditions.push(`is_active = $${values.length}`);
  }

  const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  values.push(limit);
  const limitParam = `$${values.length}`;

  values.push(offset);
  const offsetParam = `$${values.length}`;

  const rowsQuery = `
    SELECT id, code, name, address, is_active, created_at, updated_at
    FROM warehouses
    ${whereSql}
    ORDER BY code ASC
    LIMIT ${limitParam}
    OFFSET ${offsetParam}
  `;

  const countQuery = `SELECT COUNT(*)::int AS total FROM warehouses ${whereSql}`;

  const [rowsResult, countResult] = await Promise.all([
    pool.query(rowsQuery, values),
    pool.query(countQuery, values.slice(0, values.length - 2)),
  ]);

  return {
    rows: rowsResult.rows,
    total: countResult.rows[0]?.total || 0,
  };
}

async function getWarehouseById(id) {
  const { rows } = await pool.query(
    `
      SELECT id, code, name, address, is_active, created_at, updated_at
      FROM warehouses
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  return rows[0] || null;
}

async function createWarehouse({ code, name, address }) {
  const { rows } = await pool.query(
    `
      INSERT INTO warehouses (code, name, address)
      VALUES ($1, $2, $3)
      RETURNING id, code, name, address, is_active, created_at, updated_at
    `,
    [code, name, address || null],
  );

  return rows[0];
}

async function updateWarehouse(id, payload) {
  const { sets, values } = buildUpdateClause(
    {
      code: payload.code,
      name: payload.name,
      address: payload.address,
      is_active: payload.is_active,
    },
    1,
  );

  values.push(id);

  const { rows } = await pool.query(
    `
      UPDATE warehouses
      SET ${sets.join(', ')}, updated_at = NOW()
      WHERE id = $${values.length}
      RETURNING id, code, name, address, is_active, created_at, updated_at
    `,
    values,
  );

  return rows[0] || null;
}

async function softDeleteWarehouse(id) {
  const { rows } = await pool.query(
    `
      UPDATE warehouses
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
      RETURNING id, code, name, address, is_active, created_at, updated_at
    `,
    [id],
  );

  return rows[0] || null;
}

async function countActiveLocationsByWarehouseId(warehouseId) {
  const { rows } = await pool.query(
    `
      SELECT COUNT(*)::int AS total
      FROM locations
      WHERE warehouse_id = $1 AND is_active = true
    `,
    [warehouseId],
  );

  return rows[0]?.total || 0;
}

async function listLocations({ q, warehouseId, limit, offset, isActive }) {
  const conditions = [];
  const values = [];

  if (q) {
    values.push(`%${q}%`);
    conditions.push(`(l.code ILIKE $${values.length} OR l.name ILIKE $${values.length})`);
  }

  if (warehouseId) {
    values.push(warehouseId);
    conditions.push(`l.warehouse_id = $${values.length}`);
  }

  if (typeof isActive === 'boolean') {
    values.push(isActive);
    conditions.push(`l.is_active = $${values.length}`);
  }

  const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  values.push(limit);
  const limitParam = `$${values.length}`;

  values.push(offset);
  const offsetParam = `$${values.length}`;

  const rowsQuery = `
    SELECT l.id, l.warehouse_id, w.code AS warehouse_code, l.code, l.name, l.is_active, l.created_at, l.updated_at
    FROM locations l
    INNER JOIN warehouses w ON w.id = l.warehouse_id
    ${whereSql}
    ORDER BY w.code ASC, l.code ASC
    LIMIT ${limitParam}
    OFFSET ${offsetParam}
  `;

  const countQuery = `SELECT COUNT(*)::int AS total FROM locations l ${whereSql}`;

  const [rowsResult, countResult] = await Promise.all([
    pool.query(rowsQuery, values),
    pool.query(countQuery, values.slice(0, values.length - 2)),
  ]);

  return {
    rows: rowsResult.rows,
    total: countResult.rows[0]?.total || 0,
  };
}

async function getLocationById(id) {
  const { rows } = await pool.query(
    `
      SELECT id, warehouse_id, code, name, is_active, created_at, updated_at
      FROM locations
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  return rows[0] || null;
}

async function createLocation({ warehouse_id, code, name }) {
  const { rows } = await pool.query(
    `
      INSERT INTO locations (warehouse_id, code, name)
      VALUES ($1, $2, $3)
      RETURNING id, warehouse_id, code, name, is_active, created_at, updated_at
    `,
    [warehouse_id, code, name],
  );

  return rows[0];
}

async function updateLocation(id, payload) {
  const { sets, values } = buildUpdateClause(
    {
      code: payload.code,
      name: payload.name,
      is_active: payload.is_active,
    },
    1,
  );

  values.push(id);

  const { rows } = await pool.query(
    `
      UPDATE locations
      SET ${sets.join(', ')}, updated_at = NOW()
      WHERE id = $${values.length}
      RETURNING id, warehouse_id, code, name, is_active, created_at, updated_at
    `,
    values,
  );

  return rows[0] || null;
}

async function softDeleteLocation(id) {
  const { rows } = await pool.query(
    `
      UPDATE locations
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
      RETURNING id, warehouse_id, code, name, is_active, created_at, updated_at
    `,
    [id],
  );

  return rows[0] || null;
}

async function countActiveZonesByLocationId(locationId) {
  const { rows } = await pool.query(
    `
      SELECT COUNT(*)::int AS total
      FROM zones
      WHERE location_id = $1 AND is_active = true
    `,
    [locationId],
  );

  return rows[0]?.total || 0;
}

async function listZones({ q, locationId, limit, offset, isActive }) {
  const conditions = [];
  const values = [];

  if (q) {
    values.push(`%${q}%`);
    conditions.push(`(z.code ILIKE $${values.length} OR z.name ILIKE $${values.length})`);
  }

  if (locationId) {
    values.push(locationId);
    conditions.push(`z.location_id = $${values.length}`);
  }

  if (typeof isActive === 'boolean') {
    values.push(isActive);
    conditions.push(`z.is_active = $${values.length}`);
  }

  const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  values.push(limit);
  const limitParam = `$${values.length}`;

  values.push(offset);
  const offsetParam = `$${values.length}`;

  const rowsQuery = `
    SELECT z.id, z.location_id, l.code AS location_code, z.code, z.name, z.is_active, z.created_at, z.updated_at
    FROM zones z
    INNER JOIN locations l ON l.id = z.location_id
    ${whereSql}
    ORDER BY l.code ASC, z.code ASC
    LIMIT ${limitParam}
    OFFSET ${offsetParam}
  `;

  const countQuery = `SELECT COUNT(*)::int AS total FROM zones z ${whereSql}`;

  const [rowsResult, countResult] = await Promise.all([
    pool.query(rowsQuery, values),
    pool.query(countQuery, values.slice(0, values.length - 2)),
  ]);

  return {
    rows: rowsResult.rows,
    total: countResult.rows[0]?.total || 0,
  };
}

async function getZoneById(id) {
  const { rows } = await pool.query(
    `
      SELECT id, location_id, code, name, is_active, created_at, updated_at
      FROM zones
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  return rows[0] || null;
}

async function createZone({ location_id, code, name }) {
  const { rows } = await pool.query(
    `
      INSERT INTO zones (location_id, code, name)
      VALUES ($1, $2, $3)
      RETURNING id, location_id, code, name, is_active, created_at, updated_at
    `,
    [location_id, code, name],
  );

  return rows[0];
}

async function updateZone(id, payload) {
  const { sets, values } = buildUpdateClause(
    {
      code: payload.code,
      name: payload.name,
      is_active: payload.is_active,
    },
    1,
  );

  values.push(id);

  const { rows } = await pool.query(
    `
      UPDATE zones
      SET ${sets.join(', ')}, updated_at = NOW()
      WHERE id = $${values.length}
      RETURNING id, location_id, code, name, is_active, created_at, updated_at
    `,
    values,
  );

  return rows[0] || null;
}

async function softDeleteZone(id) {
  const { rows } = await pool.query(
    `
      UPDATE zones
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
      RETURNING id, location_id, code, name, is_active, created_at, updated_at
    `,
    [id],
  );

  return rows[0] || null;
}

module.exports = {
  listWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  softDeleteWarehouse,
  countActiveLocationsByWarehouseId,
  listLocations,
  getLocationById,
  createLocation,
  updateLocation,
  softDeleteLocation,
  countActiveZonesByLocationId,
  listZones,
  getZoneById,
  createZone,
  updateZone,
  softDeleteZone,
};
