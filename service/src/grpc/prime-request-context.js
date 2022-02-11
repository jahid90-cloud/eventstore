const { v4: uuid } = require('uuid');

const createPrimeRequestContextMiddleware = ({ config }) => {
    const apply = (handler) => {
        return (call, callback, context) => {
            const clientId =
                (call.metadata &&
                    Array.isArray(call.metadata.get('x-evs-client-id')) &&
                    call.metadata.get('x-evs-client-id')[0]) ||
                'unknown';
            context = {
                ...context,
                evs_traceId: uuid(),
                evs_clientId: clientId,
            };

            handler(call, callback, context);
        };
    };

    config.logger.debug('Created prime grpc request context');

    return {
        apply,
    };
};

module.exports = createPrimeRequestContextMiddleware;
