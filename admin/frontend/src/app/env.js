process.env.NODE_ENV === 'development' && require('dotenv').config();

const packageJson = require('../package.json');

const loadFromEnv = (key) => {
    if (!process.env[key]) {
        console.error(`Required environment variable [${key}] not found`);
        process.exit(-1);
    }

    return process.env[key];
};

module.exports = {
    appName: loadFromEnv('APP_NAME'),
    cookieSecret: loadFromEnv('COOKIE_SECRET'),
    databaseUrl: loadFromEnv('DATABASE_CONNECTION_STRING'),
    enableDebug: loadFromEnv('ENABLE_DEBUG') === 'true',
    env: loadFromEnv('NODE_ENV'),
    eventStoreClientId: loadFromEnv('EVENT_STORE_CLIENT_ID'),
    eventStoreServiceUrl: loadFromEnv('EVENT_STORE_SERVICE_URL'),
    eventStoreServiceCredentials: loadFromEnv(
        'EVENT_STORE_SERVICE_CREDENTIALS'
    ),
    messageStoreUrl: loadFromEnv('MESSAGE_STORE_CONNECTION_STRING'),
    port: parseInt(loadFromEnv('PORT'), 10),
    version: packageJson.version,
};
