const Bluebird = require('bluebird');
const knex = require('knex');

const createKnexClient = ({
    connectionString,
    migrationsTableName,
    isDevelopment,
}) => {
    if (isDevelopment) {
        connectionString = JSON.parse(connectionString);
    }

    const client = knex(connectionString);
    const migrationOptions = {
        tableName: migrationsTableName || 'knex_migrations',
    };

    return Bluebird.resolve(client.migrate.latest(migrationOptions)).then(
        () => client
    );
};

module.exports = createKnexClient;
