const createAttachProtoMiddleware = require('./attach-proto');
const createPrimeRequestContext = require('./prime-request-context');
const createRejectUnknownClientsMiddleware = require('./reject-unknown-clients');

const createMiddlewares = ({ env, config }) => {
    const primeRequestContext = createPrimeRequestContext({ config });
    const attachProto = createAttachProtoMiddleware({ config });
    const rejectUnknownClients = createRejectUnknownClientsMiddleware({ config });

    config.logger.debug('Created grpc middlewares');

    // Application order ( <-- )
    return [attachProto, rejectUnknownClients, primeRequestContext];
};

module.exports = createMiddlewares;
