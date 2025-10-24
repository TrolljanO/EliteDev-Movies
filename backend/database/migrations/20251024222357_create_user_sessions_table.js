/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user_sessions', function(table) {
        table.increments('id').primary();
        table.integer('user_id').notNullable()
            .references('id').inTable('users').onDelete('CASCADE');
        table.timestamp('expires_at').notNullable();
        table.text('token').notNullable().unique();
        table.timestamps(true, true);

        // Índices
        table.index('user_id', 'idx_user_sessions_user_id');
        table.index('token', 'idx_user_sessions_token');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user_sessions');
};
