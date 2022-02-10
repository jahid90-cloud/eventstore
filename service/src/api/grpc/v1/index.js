const createRead = require('./read');
const createWrite = require('./write');
const createReadLastMessage = require('./read-last-message');

const createGrpcHandlers = ({ config, eventStore }) => {
    const read = createRead({ config, eventStore });
    const last = createReadLastMessage({ config, eventStore });
    const write = createWrite({ config, eventStore });

    return {
        read,
        last,
        write,
    };
};

const createV1GrpcService = ({ config, eventStore }) => {
    const handlers = createGrpcHandlers({ config, eventStore });

    config.logger.debug('Created v1 grpc service');

    return {
        ...handlers,
    };
};

module.exports = createV1GrpcService;
