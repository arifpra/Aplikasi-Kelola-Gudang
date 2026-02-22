const pool = require('../../config/db');

async function logAudit({ actorUserId = null, action, entityType = null, entityId = null, meta = {} }, trxOrClient = null) {
  const client = trxOrClient || pool;

  await client.query(
    `
      INSERT INTO audit_events (actor_user_id, action, entity_type, entity_id, meta_json)
      VALUES ($1, $2, $3, $4, $5::jsonb)
    `,
    [actorUserId, action, entityType, entityId, JSON.stringify(meta || {})],
  );
}

module.exports = {
  logAudit,
};
