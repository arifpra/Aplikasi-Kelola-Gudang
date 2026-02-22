const { randomUUID } = require('crypto');
const ROLES = require('../../src/shared/constants/roles');
const PERMISSIONS = require('../../src/shared/constants/permissions');

/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function seed(knex) {
  const warehousePerms = [
    { code: PERMISSIONS.WAREHOUSE_SETUP_READ, name: 'Read warehouse setup' },
    { code: PERMISSIONS.WAREHOUSE_SETUP_WRITE, name: 'Write warehouse setup' },
  ];

  await knex('permissions')
    .insert(warehousePerms.map((perm) => ({ id: randomUUID(), ...perm })))
    .onConflict('code')
    .ignore();

  const adminRole = await knex('roles').select('id').where({ code: ROLES.ADMIN }).first();
  if (!adminRole) return;

  const permissionRows = await knex('permissions')
    .select('id')
    .whereIn(
      'code',
      warehousePerms.map((perm) => perm.code),
    );

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
