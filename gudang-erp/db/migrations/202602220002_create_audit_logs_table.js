/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await knex.schema.createTable('audit_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.timestamp('occurred_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.uuid('actor_user_id').nullable().references('id').inTable('users').onDelete('SET NULL');
    table.text('actor_email').nullable();
    table.text('action').notNullable();
    table.text('entity_type').nullable();
    table.text('entity_id').nullable();
    table.jsonb('meta').nullable();
    table.specificType('ip', 'inet').nullable();
    table.text('user_agent').nullable();

    table.index(['occurred_at']);
    table.index(['action']);
    table.index(['actor_user_id']);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('audit_logs');
};
