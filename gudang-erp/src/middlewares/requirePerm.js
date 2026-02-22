const ApiError = require('../shared/utils/apiError');

const requirePerm = (code) => (req, _res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Unauthorized'));
  }

  const permissions = req.user.permissions || [];
  if (!permissions.includes(code)) {
    return next(new ApiError(403, 'Forbidden'));
  }

  return next();
};

module.exports = requirePerm;
