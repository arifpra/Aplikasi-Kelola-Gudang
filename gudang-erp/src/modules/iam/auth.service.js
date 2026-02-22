const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const ApiError = require('../../shared/utils/apiError');
const { auditLog } = require('../../shared/audit/audit.service');
const authRepo = require('./auth.repo');

async function login({ email, password, req }) {
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const user = await authRepo.findUserByEmail(normalizedEmail);

  if (!user || !user.is_active) {
    await auditLog({
      actorUser: null,
      action: 'AUTH_LOGIN_FAILED',
      entityType: 'USER',
      entityId: null,
      meta: { email: normalizedEmail },
      req,
    });
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    await auditLog({
      actorUser: { id: user.id, email: user.email },
      action: 'AUTH_LOGIN_FAILED',
      entityType: 'USER',
      entityId: user.id,
      meta: { email: normalizedEmail },
      req,
    });
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

  await auditLog({
    actorUser: { id: userWithAccess.id, email: userWithAccess.email },
    action: 'AUTH_LOGIN_SUCCESS',
    entityType: 'USER',
    entityId: userWithAccess.id,
    meta: null,
    req,
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
