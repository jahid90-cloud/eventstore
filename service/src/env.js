const isDevelopment = process.env.NODE_ENV === 'development';

isDevelopment && require('dotenv').config();

const loadFromEnvironment = (key) => {
    if (!process.env[key]) {
        throw new Error(`Looking for environment variable [${key}] failed`);
    }

    return process.env[key];
};

const createEnv = () => {
    return {
        appName: loadFromEnvironment('APP_NAME'),
        port: loadFromEnvironment('PORT'),
        isProduction: !isDevelopment,
        eventstoreConnectionString: loadFromEnvironment('EVENTSTORE_CONNECTION_STRING'),
        grpcAddress: loadFromEnvironment('GRPC_SERVER_ADDRESS'),
    };
};

module.exports = createEnv;
