const ApiError = require('../shared/utils/apiError');

const validate = (validator) => (req, _res, next) => {
  const result = validator(req);

  if (result.error) {
    return next(new ApiError(400, result.error));
  }

  if (result.value?.body) {
    req.body = result.value.body;
  }

  if (result.value?.query) {
    req.query = result.value.query;
  }

  return next();
};

module.exports = validate;
