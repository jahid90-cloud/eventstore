const express = require('express');

const mountLocals = require('./mount-locals');
const mountMiddlewares = require('./mount-middlewares');
const mountRoutes = require('./mount-routes');

const createExpressApp = ({ env, config }) => {
    const app = express();

    mountLocals(app);
    mountMiddlewares(app);
    mountRoutes(app, config);

    return app;
};

module.exports = createExpressApp;
