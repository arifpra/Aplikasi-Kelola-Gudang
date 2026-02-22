const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../shared/utils/apiError');
const authRepo = require('../modules/iam/auth.repo');

const auth = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Unauthorized');
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      throw new ApiError(401, 'Unauthorized');
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const userId = payload.sub;

    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    const user = await authRepo.findUserWithAccessById(userId);
    if (!user || !user.isActive) {
      throw new ApiError(401, 'Unauthorized');
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions,
    };

    return next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }

    return next(new ApiError(401, 'Unauthorized'));
  }
};

module.exports = auth;
