const express = require('express');

const createMountMiddlewares = require('./mount-middlewares');
const createMountRoutes = require('./mount-routes');
const createClient = require('./client');

const createExpressApp = ({ env, config }) => {
    const app = express();

    const mountMiddlewares = createMountMiddlewares({ env, config });
    const mountRoutes = createMountRoutes({ config });
    const client = createClient({ env, config });

    mountMiddlewares(app);
    mountRoutes(app);

    const signalAppStart = () => {
        config.logger.info(`Started ${env.appName} rest server on port: ${env.port}`);
    };

    const start = () => {
        app.listen(env.port, signalAppStart);
    };

    const stop = () => {
        app.stop();
    };

    return {
        start,
        stop,
        testRunClient: client.testRun,
    };
};

module.exports = createExpressApp;
