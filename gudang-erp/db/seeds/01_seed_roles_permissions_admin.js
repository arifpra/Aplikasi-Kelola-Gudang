const { randomUUID } = require('crypto');
const ROLES = require('../../src/shared/constants/roles');
const PERMISSIONS = require('../../src/shared/constants/permissions');

/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function seed(knex) {
  const roles = [
    { code: ROLES.ADMIN, name: 'Administrator' },
    { code: ROLES.PURCH, name: 'Purchasing' },
    { code: ROLES.WH_RM, name: 'Warehouse Raw Material' },
    { code: ROLES.QC, name: 'Quality Control' },
    { code: ROLES.PROD, name: 'Production' },
    { code: ROLES.WH_FG, name: 'Warehouse Finished Goods' },
    { code: ROLES.SALES, name: 'Sales' },
  ];

  const permissions = [
    { code: PERMISSIONS.MASTERDATA_READ, name: 'Read master data' },
    { code: PERMISSIONS.MASTERDATA_WRITE, name: 'Write master data' },
    { code: PERMISSIONS.GRN_READ, name: 'Read GRN' },
    { code: PERMISSIONS.GRN_WRITE, name: 'Write GRN' },
    { code: PERMISSIONS.GRN_POST, name: 'Post GRN' },
    { code: PERMISSIONS.QC_DECIDE, name: 'Make QC decision' },
    { code: PERMISSIONS.STOCK_READ, name: 'Read stock' },
  ];

  await knex('roles')
    .insert(roles.map((role) => ({ id: randomUUID(), ...role })))
    .onConflict('code')
    .ignore();

  await knex('permissions')
    .insert(permissions.map((permission) => ({ id: randomUUID(), ...permission })))
    .onConflict('code')
    .ignore();

  const adminRole = await knex('roles').select('id').where({ code: ROLES.ADMIN }).first();
  if (!adminRole) return;

  const allPermissions = await knex('permissions').select('id');
  if (!allPermissions.length) return;

  await knex('role_permissions')
    .insert(
      allPermissions.map((permission) => ({
        role_id: adminRole.id,
        permission_id: permission.id,
      })),
    )
    .onConflict(['role_id', 'permission_id'])
    .ignore();
};
