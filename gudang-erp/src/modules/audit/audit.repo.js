const pool = require('../../config/db');

async function listAuditLogs({ limit, offset, action }) {
  const values = [];
  const conditions = [];

  if (action) {
    values.push(action);
    conditions.push(`action = $${values.length}`);
  }

  const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  values.push(limit);
  const limitParam = `$${values.length}`;

  values.push(offset);
  const offsetParam = `$${values.length}`;

  const listQuery = `
    SELECT id, occurred_at, actor_user_id, actor_email, action, entity_type, entity_id, meta, ip, user_agent
    FROM audit_logs
    ${whereSql}
    ORDER BY occurred_at DESC
    LIMIT ${limitParam}
    OFFSET ${offsetParam}
  `;

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM audit_logs
    ${whereSql}
  `;

  const [listResult, countResult] = await Promise.all([
    pool.query(listQuery, values),
    pool.query(countQuery, values.slice(0, values.length - 2)),
  ]);

  return {
    rows: listResult.rows,
    total: countResult.rows[0]?.total || 0,
  };
}

module.exports = {
  listAuditLogs,
};
