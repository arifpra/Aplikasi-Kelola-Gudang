const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');
const ROLES = require('../../src/shared/constants/roles');

/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function seed(knex) {
  const email = 'admin@local';

  const existingUser = await knex('users').select('id').where({ email }).first();
  if (!existingUser) {
    const passwordHash = await bcrypt.hash('Admin123!', 10);

    await knex('users')
      .insert({
        id: randomUUID(),
        name: 'Admin',
        email,
        password_hash: passwordHash,
        is_active: true,
      })
      .onConflict('email')
      .ignore();
  }

  const user = await knex('users').select('id').where({ email }).first();
  const adminRole = await knex('roles').select('id').where({ code: ROLES.ADMIN }).first();

  if (!user || !adminRole) return;

  await knex('user_roles')
    .insert({ user_id: user.id, role_id: adminRole.id })
    .onConflict(['user_id', 'role_id'])
    .ignore();
};
