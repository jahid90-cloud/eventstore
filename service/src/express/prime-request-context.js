const { v4: uuid } = require('uuid');

const createPrimeRequestContext = ({ config }) => {
    const primeRequestContext = (req, res, next) => {
        req.context = {
            traceId: uuid(),
        };

        next();
    };

    config.logger.debug('Created prime request context');

    return primeRequestContext;
};

module.exports = createPrimeRequestContext;
