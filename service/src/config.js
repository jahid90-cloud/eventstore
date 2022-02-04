const createLogger = require('./logger');

const createConfig = ({ env }) => {
    const logger = createLogger({ env });

    return {
        logger,
    };
};

module.exports = createConfig;
