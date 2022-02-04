const createMountRoutes = ({ config }) => {
    const mountRoutes = (app) => {
        app.use('/', config.pingService.router);
        app.use('/v1', config.v1Service.router);

        config.logger.debug('Routes attached');
    };

    config.logger.debug('Created mount routes');

    return mountRoutes;
};

module.exports = createMountRoutes;
