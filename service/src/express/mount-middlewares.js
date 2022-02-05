const bodyParser = require('body-parser');

const createAttachLocals = require('./attach-locals');
const createFinalErrorHandler = require('./final-error-handler');
const createPrimeRequestContext = require('./prime-request-context');

const createMountMiddlewares = ({ config }) => {
    const mountMiddlewares = (app) => {
        const finalErrorHandler = createFinalErrorHandler({ config });
        const primeRequestContext = createPrimeRequestContext({ config });
        const attachLocals = createAttachLocals({ config });

        app.use(finalErrorHandler);
        app.use(primeRequestContext);
        app.use(attachLocals);
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        config.logger.debug('Middlewares attached');
    };

    config.logger.debug('Created mount middlewares');

    return mountMiddlewares;
};

module.exports = createMountMiddlewares;
