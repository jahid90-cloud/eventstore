const createPickupTransport = require('nodemailer-pickup-transport');
const createMessageStore = require('@jahiduls/lib-message-store');

const createPostgresClient = require('./postgres-client');

const createIdentityComponent = require('./identity');
const createSendEmailComponent = require('./send-email');
const createAdminComponent = require('./admin');

const createConfig = ({ env }) => {
    const postgresClient = createPostgresClient({
        connectionString: env.messageStoreConnectionString,
    });
    const messageStore = createMessageStore({ db: postgresClient, driver: 'postgres' });
    const transport = createPickupTransport({ directory: env.emailDirectory });

    const identityComponent = createIdentityComponent({ messageStore });
    const sendEmailComponent = createSendEmailComponent({
        messageStore,
        systemSenderEmailAddress: env.systemSenderEmailAddress,
        transport,
    });
    const adminComponent = createAdminComponent({ messageStore });

    const components = [identityComponent, sendEmailComponent, adminComponent];

    return {
        messageStore,
        components,
    };
};

module.exports = createConfig;
