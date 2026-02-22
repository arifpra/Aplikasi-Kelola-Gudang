const pool = require('../../config/db');

async function auditLog({ actorUser = null, action, entityType = null, entityId = null, meta = null, req = null }) {
  try {
    const actorUserId = actorUser?.id || null;
    const actorEmail = actorUser?.email || null;
    const ip = req?.ip || null;
    const userAgent = req?.headers?.['user-agent'] || null;

    await pool.query(
      `
        INSERT INTO audit_logs (
          actor_user_id,
          actor_email,
          action,
          entity_type,
          entity_id,
          meta,
          ip,
          user_agent
        )
        VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8)
      `,
      [actorUserId, actorEmail, action, entityType, entityId, meta ? JSON.stringify(meta) : null, ip, userAgent],
    );
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[audit] failed to write audit log:', error.message);
    }
  }
}

module.exports = {
  auditLog,
};
