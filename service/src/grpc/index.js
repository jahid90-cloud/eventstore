const grpc = require('@grpc/grpc-js');

const createMiddlewares = require('./middlewares');
const createMountRoutes = require('./mount-routes');
const createClient = require('./client');

const createGrpcServer = ({ env, config }) => {
    const server = new grpc.Server();

    const middlewares = createMiddlewares({ config });
    const mountRoutes = createMountRoutes({ config });
    const client = createClient({ env, config });

    mountRoutes(server, middlewares);

    const signalBindSuccess = () => {
        server.start();
        config.logger.info(`Started ${env.appName} grpc server at: ${env.grpcAddress}`);
    };

    const start = () => {
        server.bindAsync(env.grpcAddress, grpc.ServerCredentials.createInsecure(), signalBindSuccess);
    };

    const stop = () => {
        server.stop();
    };

    return {
        start,
        stop,
        testRunClient: client.testRun,
    };
};

module.exports = createGrpcServer;
