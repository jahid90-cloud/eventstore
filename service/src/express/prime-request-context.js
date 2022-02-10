const { v4: uuid } = require('uuid');

const createPrimeRequestContext = ({ config }) => {
    const primeRequestContext = (req, res, next) => {
        req.context = {
            traceId: uuid(),
            userId: req.session ? req.session.userId : null,
            isAdmin: req.session.role ? req.session.role.includes('admin') : false,
        };

        next();
    };

    config.logger.debug('Created prime http request context');

    return primeRequestContext;
};

module.exports = createPrimeRequestContext;
