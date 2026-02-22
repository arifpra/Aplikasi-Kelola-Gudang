const asyncHandler = require('../../shared/utils/asyncHandler');
const { sendSuccess } = require('../../shared/utils/apiResponse');
const auditService = require('./audit.service');

const listLogs = asyncHandler(async (req, res) => {
  const { limit, offset, action } = req.query;
  const result = await auditService.getAuditLogs({ limit, offset, action });

  return sendSuccess(
    res,
    result.rows,
    200,
    'OK',
    {
      limit,
      offset,
      total: result.total,
    },
  );
});

module.exports = {
  listLogs,
};
