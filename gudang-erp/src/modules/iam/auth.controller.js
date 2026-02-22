const { sendSuccess } = require('../../shared/utils/apiResponse');
const asyncHandler = require('../../shared/utils/asyncHandler');
const authService = require('./auth.service');

const login = asyncHandler(async (req, res) => {
  const data = await authService.login({
    email: req.body.email,
    password: req.body.password,
    ip: req.ip,
    userAgent: req.headers['user-agent'] || '',
  });

  return sendSuccess(res, data, 200, 'Login success');
});

const me = asyncHandler(async (req, res) => {
  const data = await authService.me(req.user.id);
  return sendSuccess(res, data, 200, 'OK');
});

module.exports = {
  login,
  me,
};
