const { v4: uuid } = require('uuid');

const createPrimeRequestContextMiddleware = ({ config }) => {
    const apply = (handler) => {
        return (call, callback, context) => {
            context = context || {};
            context.traceId = uuid();
            handler(call, callback, context);
        };
    };

    config.logger.debug('Created prime grpc request context');

    return {
        apply,
    };
};

module.exports = createPrimeRequestContextMiddleware;
