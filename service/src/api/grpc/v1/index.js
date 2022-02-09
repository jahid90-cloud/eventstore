const createRead = require('./read');
const createWrite = require('./write');
const createReadLastMessage = require('./read-last-message');

const createGrpcHandlers = ({ config, eventStore }) => {
    const handleRead = createRead({ config, eventStore });
    const handleReadLastMessage = createReadLastMessage({ config, eventStore });
    const handleWrite = createWrite({ config, eventStore });

    return {
        handleRead,
        handleReadLastMessage,
        handleWrite,
    };
};

const createV1GrpcService = ({ config, eventStore }) => {
    const handlers = createGrpcHandlers({ config, eventStore });

    config.logger.debug('Created v1 grpc service');

    return {
        read: handlers.handleRead,
        last: handlers.handleReadLastMessage,
        write: handlers.handleWrite,
    };
};

module.exports = createV1GrpcService;
