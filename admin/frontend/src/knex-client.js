const Bluebird = require('bluebird');
const knex = require('knex');

const createKnexClient = ({ connectionString, parseAsJson }) => {
    if (parseAsJson) {
        connectionString = JSON.parse(connectionString);
    }

    const client = knex(connectionString);
    return Bluebird.resolve(client);
};

module.exports = createKnexClient;
