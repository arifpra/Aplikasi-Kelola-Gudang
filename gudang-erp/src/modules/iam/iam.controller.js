const asyncHandler = require('../../shared/utils/asyncHandler');
const { sendSuccess } = require('../../shared/utils/apiResponse');
const iamService = require('./iam.service');

const listRoles = asyncHandler(async (_req, res) => {
  const data = await iamService.getRoles();
  return sendSuccess(res, data, 200, 'OK');
});

const listPermissions = asyncHandler(async (_req, res) => {
  const data = await iamService.getPermissions();
  return sendSuccess(res, data, 200, 'OK');
});

module.exports = {
  listRoles,
  listPermissions,
};
