const createPrimeRequestContext = require('./prime-request-context');

const createMiddlewares = ({ env, config }) => {
    const primeRequestContext = createPrimeRequestContext({ config });

    config.logger.debug('grpc middlewares created');

    return [primeRequestContext];
};

module.exports = createMiddlewares;
