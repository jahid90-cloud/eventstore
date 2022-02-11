const Bluebird = require('bluebird');
const knex = require('knex');

const createKnexClient = ({ connectionString, isDevelopment }) => {
    if (isDevelopment) {
        connectionString = JSON.parse(connectionString);
    }

    const client = knex(connectionString);
    return Bluebird.resolve(client);
};

module.exports = createKnexClient;
