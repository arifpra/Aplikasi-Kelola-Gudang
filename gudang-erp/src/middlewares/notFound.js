const ApiError = require('../utils/apiError');

const notFound = (req, _res, next) => {
  next(new ApiError(404, `Endpoint tidak ditemukan: ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;
