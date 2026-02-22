const ApiError = require('../../shared/utils/apiError');

const validateLoginBody = (req) => {
  const body = req.body || {};
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email) {
    return { error: 'email is required' };
  }

  if (!password) {
    return { error: 'password is required' };
  }

  return {
    value: {
      body: {
        email,
        password,
      },
    },
  };
};

const ensureUserContext = (req) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }
};

module.exports = {
  validateLoginBody,
  ensureUserContext,
};
