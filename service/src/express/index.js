const express = require('express');

const createMountMiddlewares = require('./mount-middlewares');
const createMountRoutes = require('./mount-routes');

const createExpressApp = ({ env, config }) => {
    const app = express();

    const mountMiddlewares = createMountMiddlewares({ config });
    const mountRoutes = createMountRoutes({ config });

    mountMiddlewares(app);
    mountRoutes(app);

    return app;
};

module.exports = createExpressApp;
