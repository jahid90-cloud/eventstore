const createKnexClient = require('./knex-client');
const createPostgresClient = require('./postgres-client');
const createMessageStore = require('@jahiduls/lib-message-store');

const createUserCredentialsAggregator = require('./users/user-credentials');
const createAdminUsersAggregator = require('./admin/admin-users');
const createAdminStreamsAggregator = require('./admin/admin-streams');
const createAdminCategoriesAggregator = require('./admin/admin-categories');
const createAdminSubscriberPositionsAggregator = require('./admin/admin-subscriber-positions');
const createAdminEventTypesAggregator = require('./admin/admin-event-types');
const createAdminEntitiesAggregator = require('./admin/admin-entities');

const createConfig = ({ env }) => {
    const knexClient = createKnexClient({
        connectionString: env.databaseUrl,
        isDevelopment: env.env === 'development',
    });
    const postgresClient = createPostgresClient({
        connectionString: env.messageStoreConnectionString,
    });
    const messageStore = createMessageStore({ db: postgresClient, driver: 'postgres' });

    const userCredentialsAggregator = createUserCredentialsAggregator({
        db: knexClient,
        messageStore,
    });
    const adminUsersAggregator = createAdminUsersAggregator({
        db: knexClient,
        messageStore,
    });
    const adminStreamsAggregator = createAdminStreamsAggregator({
        db: knexClient,
        messageStore,
    });
    const adminCategoriesAggregator = createAdminCategoriesAggregator({
        db: knexClient,
        messageStore,
    });
    const adminSubscriberPositionsAggregator = createAdminSubscriberPositionsAggregator({
        db: knexClient,
        messageStore,
    });
    const adminEntitiesAggregator = createAdminEntitiesAggregator({
        db: knexClient,
        messageStore,
    });
    const adminEventTypesAggregator = createAdminEventTypesAggregator({
        db: knexClient,
        messageStore,
    });

    const aggregators = [
        userCredentialsAggregator,
        adminUsersAggregator,
        adminStreamsAggregator,
        adminCategoriesAggregator,
        adminSubscriberPositionsAggregator,
        adminEntitiesAggregator,
        adminEventTypesAggregator,
    ];

    return {
        knexClient,
        messageStore,
        aggregators,
    };
};

module.exports = createConfig;
