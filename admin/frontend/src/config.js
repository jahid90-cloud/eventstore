const createKnexClient = require('./knex-client');

const createEventStoreService = require('./services/event-store-service');

const createHomeApp = require('./apps/home');
const createAdminApp = require('./apps/admin');
const createRegisterUsersApp = require('./apps/register-users');
const createAuthenticationApp = require('./apps/authenticate');
const createManageUsersApp = require('./apps/manage-users');

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
        homeApp,
        adminApp,
        registerUsersApp,
        authenticationApp,
        manageUsersApp,
    };
};

module.exports = createConfig;
