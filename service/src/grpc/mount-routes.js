const createProtoDescriptorLoader = require('./proto-descriptor-loader');

const createMountRoutes = ({ config }) => {
    const protoDescriptorLoader = createProtoDescriptorLoader({ config });
    const protoDescriptor = protoDescriptorLoader.load();
    const service = config.v1GrpcService;

    const mountRoutes = (server, middlewares) => {
        // Extract the main handlers
        let writeHandler = service.write.handlers.write;
        let readHandler = service.read.handlers.read;
        let lastHandler = service.last.handlers.readLastMessage;

        // NOTE: handlers are invoked in reverse order of decoration
        // If a decorator depends on another, it should be applied before the other

        // Decorate with handler specific middlewares
        service.write.middlewares.forEach((m) => {
            writeHandler = m.apply(writeHandler);
        });
        service.read.middlewares.forEach((m) => {
            readHandler = m.apply(readHandler);
        });
        service.last.middlewares.forEach((m) => {
            lastHandler = m.apply(lastHandler);
        });

        // Decorate with common middlewares
        middlewares.forEach((m) => {
            writeHandler = m.apply(writeHandler);
            readHandler = m.apply(readHandler);
            lastHandler = m.apply(lastHandler);
        });

        config.logger.debug('grpc middlewares mounted');

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
