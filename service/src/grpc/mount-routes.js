const createProtoDescriptorLoader = require('./proto-descriptor-loader');

const createMountRoutes = ({ config }) => {
    const protoDescriptorLoader = createProtoDescriptorLoader({ config });
    const protoDescriptor = protoDescriptorLoader.load();
    const service = config.v1GrpcService;

    const mountRoutes = (server, middlewares) => {
        let writeHandler = service.write;
        let readHandler = service.read;
        let lastHandler = service.last;

        middlewares.forEach((middleware) => {
            writeHandler = middleware.apply(writeHandler);
            readHandler = middleware.apply(readHandler);
            lastHandler = middleware.apply(lastHandler);
        });

        server.addService(protoDescriptor.v1.EventStore.service, {
            write: writeHandler,
            read: readHandler,
            last: lastHandler,
        });

        config.logger.debug('grpc routes mounted');
    };

    config.logger.debug('Created grpc mount routes');

    return mountRoutes;
};

module.exports = createMountRoutes;
