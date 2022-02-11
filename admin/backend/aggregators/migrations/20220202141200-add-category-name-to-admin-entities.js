exports.up = (knex) => {
    return knex.schema.alterTable('admin_entities', (table) => {
        table.string('category_name');
    });
};

exports.down = (knex) =>
    knex.schema.alterTable('admin_entities', (table) => {
        table.dropColumn('category_name');
    });
