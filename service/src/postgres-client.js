const Bluebird = require('bluebird');
const pg = require('pg');

const createPostgresClient = ({ config }) => {
    const connectionString = config.env.eventstoreConnectionString;
    const client = new pg.Client({ connectionString });

    return client
        .connect()
        .then(() => client.query('SET search_path=public,message_store'))
        .then(() => Bluebird.resolve(client));
};

module.exports = createPostgresClient;
