const createEnv = require('./env');
const createConfig = require('./config');
const createRestServer = require('./express');
const createGrpcServer = require('./grpc');

const start = () => {
    const env = createEnv();
    const config = createConfig({ env });
    const restServer = createRestServer({ env, config });
    const grpcServer = createGrpcServer({ env, config });

    restServer.start();
    grpcServer.start();

    env.enableGrpcTestRun && setTimeout(() => grpcServer.testRunClient(), 2 * 1000);
};

module.exports = {
    start,
};
