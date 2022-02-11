const createKnexClient = require('./knex-client');
const createPostgresClient = require('./postgres-client');
const createMessageStore = require('@jahid90/message-store');

const createHomeApp = require('./home');
const createAdminApp = require('./admin');
const createRegisterUsersApp = require('./register-users');
const createAuthenticationApp = require('./authenticate');
const createManageUsersApp = require('./manage-users');

const createConfig = ({ env }) => {
    const knexClient = createKnexClient({
        connectionString: env.databaseUrl,
        isDevelopment: env.env === 'development',
    });
    const postgresClient = createPostgresClient({
        connectionString: env.messageStoreConnectionString,
    });
    const messageStore = createMessageStore({ db: postgresClient });

    const homeApp = createHomeApp();
    const adminApp = createAdminApp({
        db: knexClient,
        messageStoreDb: postgresClient,
        messageStore,
    });
    const registerUsersApp = createRegisterUsersApp({
        db: knexClient,
        messageStore,
    });
    const authenticationApp = createAuthenticationApp({
        db: knexClient,
        messageStore,
    });
    const manageUsersApp = createManageUsersApp({
        db: knexClient,
        messageStore,
    });

    return {
        knexClient,
        messageStore,
        homeApp,
        adminApp,
        registerUsersApp,
        authenticationApp,
        manageUsersApp,
    };
};

module.exports = createConfig;
