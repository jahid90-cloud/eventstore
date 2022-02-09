const createPrimeRequestContext = require('./prime-request-context');

const createMiddlewares = ({ env, config }) => {
    const primeRequestContext = createPrimeRequestContext({ config });

    config.logger.debug('Created grpc middlewares');

    return [primeRequestContext];
};

module.exports = createMiddlewares;
