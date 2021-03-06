exports.up = (knex) => {
    return knex.schema.createTable('admin_entities', (table) => {
        table.string('id').primary();
        table.integer('message_count').defaultsTo(0);
        table.string('last_message_id');
        table.integer('last_message_global_position').defaultsTo(0);
    });
};

exports.down = (knex) => knex.schema.dropTable('admin_entities');
