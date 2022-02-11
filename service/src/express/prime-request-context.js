const { v4: uuid } = require('uuid');

const CLIENT_ID_HEADER = 'x-evs-client-id';

const createPrimeRequestContext = ({ config }) => {
    const primeRequestContext = (req, res, next) => {
        req.context = {
            evs_traceId: uuid(),
            evs_clientId: req.header(CLIENT_ID_HEADER) || 'unknown',
        };

        next();
    };

    config.logger.debug('Created prime http request context');

    return primeRequestContext;
};

module.exports = createPrimeRequestContext;
