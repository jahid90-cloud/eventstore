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
        enableGrpcTestRun: loadFromEnvironment('ENABLE_GRPC_TEST_RUN') === '1',
        eventstoreConnectionString: loadFromEnvironment('EVENTSTORE_CONNECTION_STRING'),
        grpcAddress: loadFromEnvironment('GRPC_SERVER_ADDRESS'),
        env: loadFromEnvironment('NODE_ENV'),
        port: parseInt(loadFromEnvironment('PORT'), 10),
    };
};

module.exports = createEnv;
