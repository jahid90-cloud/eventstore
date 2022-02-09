const bodyParser = require('body-parser');
const cors = require('cors');

const createAttachLocals = require('./attach-locals');
const createFinalErrorHandler = require('./final-error-handler');
const createPrimeRequestContext = require('./prime-request-context');

const createMountMiddlewares = ({ env, config }) => {
    const mountMiddlewares = (app) => {
        const finalErrorHandler = createFinalErrorHandler({ config });
        const primeRequestContext = createPrimeRequestContext({ config });
        const attachLocals = createAttachLocals({ config });

        app.use(finalErrorHandler);
        app.use(primeRequestContext);
        app.use(attachLocals);
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        if (!env.isProduction) app.use(cors());

        config.logger.debug('http middlewares mounted');
    };

    config.logger.debug('Created mount http middlewares');

    return mountMiddlewares;
};

module.exports = createMountMiddlewares;
