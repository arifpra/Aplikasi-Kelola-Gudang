const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const ApiError = require('../../shared/utils/apiError');
const { logAudit } = require('../../shared/audit/audit.service');
const authRepo = require('./auth.repo');

async function login({ email, password, ip, userAgent }) {
  const user = await authRepo.findUserByEmail(email);

  if (!user || !user.is_active) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const userWithAccess = await authRepo.findUserWithAccessById(user.id);
  if (!userWithAccess) {
    throw new ApiError(401, 'Invalid user');
  }

  const accessToken = jwt.sign(
    {
      sub: userWithAccess.id,
      email: userWithAccess.email,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );

  await logAudit({
    actorUserId: userWithAccess.id,
    action: 'AUTH_LOGIN',
    entityType: 'USER',
    entityId: userWithAccess.id,
    meta: {
      ip,
      userAgent,
    },
  });

  return {
    accessToken,
    user: {
      id: userWithAccess.id,
      name: userWithAccess.name,
      email: userWithAccess.email,
      roles: userWithAccess.roles,
      permissions: userWithAccess.permissions,
    },
  };
}

async function me(userId) {
  const userWithAccess = await authRepo.findUserWithAccessById(userId);

  if (!userWithAccess || !userWithAccess.isActive) {
    throw new ApiError(401, 'Unauthorized');
  }

  return {
    user: {
      id: userWithAccess.id,
      name: userWithAccess.name,
      email: userWithAccess.email,
      roles: userWithAccess.roles,
      permissions: userWithAccess.permissions,
    },
  };
}

module.exports = {
  login,
  me,
};
