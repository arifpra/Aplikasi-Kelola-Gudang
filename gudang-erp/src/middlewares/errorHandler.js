const ApiError = require('../shared/utils/apiError');

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : 'Internal Server Error';
  const details = err instanceof ApiError ? err.details : null;

  if (!(err instanceof ApiError)) {
    console.error(err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    details,
  });
};

module.exports = errorHandler;
