const createEnv = require('./env');
const createConfig = require('./config');
const createApp = require('./express');

const start = () => {
    const env = createEnv();
    const config = createConfig({ env });
    const app = createApp({ env, config });

    const signalAppStart = () => {
        config.logger.info(`${env.appName} started on port: ${env.port}`);
    };

    app.listen(env.port, signalAppStart);
};

module.exports = {
    start,
};
