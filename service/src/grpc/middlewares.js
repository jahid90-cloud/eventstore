const createAttachProtoMiddleware = require('./attach-proto');
const createPrimeRequestContext = require('./prime-request-context');

const createMiddlewares = ({ env, config }) => {
    const primeRequestContext = createPrimeRequestContext({ config });
    const attachProto = createAttachProtoMiddleware({ config });

    config.logger.debug('Created grpc middlewares');

    return [primeRequestContext, attachProto];
};

module.exports = createMiddlewares;
