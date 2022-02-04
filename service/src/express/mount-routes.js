const createMountRoutes = ({ config }) => {
    const mountRoutes = (app) => {
        app.use('/', (req, res, next) => {
            return res.send('Hello World');
        });

        config.logger.debug('Routes attached');
    };

    config.logger.debug('Created mount routes');

    return mountRoutes;
};

module.exports = createMountRoutes;
