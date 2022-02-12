const createRejectUnknownClientsMiddleware = ({ config }) => {
    const rejectUnknownClients = (req, res, next) => {
        if (!req.context.evs_clientId || req.context.evs_clientId === 'unknown') {
            res.sendStatus(401);
        } else {
            next();
        }
    };

    config.logger.debug('Created reject unknown http clients');

    return rejectUnknownClients;
};

module.exports = createRejectUnknownClientsMiddleware;
