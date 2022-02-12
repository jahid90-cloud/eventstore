const ApiError = require('../api/errors/api-error');

const createRejectUnknownClientsMiddleware = ({ config }) => {
    const apply = (handler) => {
        return (call, callback, context) => {
            if (!context.evs_clientId || context.evs_clientId === 'unknown') {
                callback(new ApiError('Unauthorised', 401), null);
            } else {
                handler(call, callback, context);
            }
        };
    };

    config.logger.debug('Created reject unknown grpc clients');

    return {
        apply,
    };
};

module.exports = createRejectUnknownClientsMiddleware;
