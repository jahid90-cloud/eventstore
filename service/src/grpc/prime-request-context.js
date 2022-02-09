const { v4: uuid } = require('uuid');

const createPrimeRequestContextMiddleware = ({ config }) => {
    const apply = (handler) => {
        return (call, callback) => {
            call.request.context = {
                ...call.request.context,
                traceId: uuid(),
            };

            handler(call, callback);
        };
    };

    config.logger.debug('Created prime grpc request context');

    return {
        apply,
    };
};

module.exports = createPrimeRequestContextMiddleware;
