const createKnexClient = require('./knex-client');

const createEventStoreService = require('./services/event-store-service');

const createHomeApp = require('./home');
const createAdminApp = require('./admin');
const createRegisterUsersApp = require('./register-users');
const createAuthenticationApp = require('./authenticate');
const createManageUsersApp = require('./manage-users');

const createConfig = ({ env }) => {
    const knexClient = createKnexClient({
        connectionString: env.databaseUrl,
        parseAsJson: env.env === 'development',
    });
    const mdbClient = createKnexClient({
        connectionString: env.messageStoreUrl,
        parseAsJson: false,
    });

    const eventStoreService = createEventStoreService({ env });
    const services = { eventStore: eventStoreService };

    const homeApp = createHomeApp();
    const adminApp = createAdminApp({
        db: knexClient,
        mdb: mdbClient,
        services,
    });
    const registerUsersApp = createRegisterUsersApp({
        db: knexClient,
        services,
    });
    const authenticationApp = createAuthenticationApp({
        db: knexClient,
        services,
    });
    const manageUsersApp = createManageUsersApp({
        db: knexClient,
        mdb: mdbClient,
        services,
    });

    return {
        eventStoreService,
        homeApp,
        adminApp,
        registerUsersApp,
        authenticationApp,
        manageUsersApp,
    };
};

module.exports = createConfig;
