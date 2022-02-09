const Bluebird = require('bluebird');
const pg = require('pg');

const createPostgresClient = ({ config }) => {
    const connectionString = config.env.eventstoreConnectionString;
    const client = new pg.Client({ connectionString, Promise: Bluebird });

    let connectedClient = null;

    const connect = () => {
        if (!connectedClient) {
            connectedClient = client
                .connect()
                .then(() => client.query('SET search_path=public,message_store'))
                .then(() => client);
        }

        return connectedClient;
    };

    const query = (sql, values = []) => {
        return connect().then((client) => client.query(sql, values));
    };

    const stop = () => client.end();

    return {
        query,
        stop,
    };
};

module.exports = createPostgresClient;
