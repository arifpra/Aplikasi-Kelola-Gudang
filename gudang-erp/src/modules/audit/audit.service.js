const auditRepo = require('./audit.repo');

async function getAuditLogs({ limit, offset, action }) {
  return auditRepo.listAuditLogs({ limit, offset, action });
}

module.exports = {
  getAuditLogs,
};
