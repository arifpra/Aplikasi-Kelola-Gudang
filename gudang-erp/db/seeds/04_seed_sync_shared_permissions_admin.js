const { randomUUID } = require('crypto');
const ROLES = require('../../src/shared/constants/roles');
const PERMISSIONS = require('../../src/shared/constants/permissions');

function toPermissionName(code) {
  return code
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function seed(knex) {
  const permissionCodes = Object.values(PERMISSIONS);

  await knex('permissions')
    .insert(
      permissionCodes.map((code) => ({
        id: randomUUID(),
        code,
        name: toPermissionName(code),
      })),
    )
    .onConflict('code')
    .ignore();

  const adminRole = await knex('roles').select('id').where({ code: ROLES.ADMIN }).first();
  if (!adminRole) return;

  const permissionRows = await knex('permissions').select('id').whereIn('code', permissionCodes);
  if (!permissionRows.length) return;

  await knex('role_permissions')
    .insert(
      permissionRows.map((perm) => ({
        role_id: adminRole.id,
        permission_id: perm.id,
      })),
    )
    .onConflict(['role_id', 'permission_id'])
    .ignore();
};
