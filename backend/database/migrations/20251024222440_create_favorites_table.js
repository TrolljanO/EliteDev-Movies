/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('favorites', function(table) {
        table.increments('id').primary();
        table.integer('user_id').notNullable()
            .references('id').inTable('users').onDelete('CASCADE');
        table.integer('movie_id').notNullable();
        table.string('movie_title', 500);
        table.text('movie_poster_path');
        table.text('movie_overview');
        table.string('movie_release_date', 50);
        table.timestamp('created_at').defaultTo(knex.fn.now());

        // Constraint: Um usuário não pode favoritar o mesmo filme duas vezes
        table.unique(['user_id', 'movie_id']);

        // Índice para performance
        table.index('user_id', 'idx_favorites_user_id');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('favorites');
};
