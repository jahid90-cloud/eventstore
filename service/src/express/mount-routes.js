const createMountRoutes = ({ config }) => {
    const mountRoutes = (app) => {
        app.use('/', config.pingService.router);
        app.use('/v1', config.v1HttpService.router);

        config.logger.debug('http routes attached');
    };

    config.logger.debug('Created mount http routes');

    return mountRoutes;
};

module.exports = createMountRoutes;
