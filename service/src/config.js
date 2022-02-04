const createLogger = require('./logger');

const eventStore = require('../lib/event-store');
const createV1Service = require('./api/v1');

const createConfig = ({ env }) => {
    const logger = createLogger({ env });

    const v1Service = createV1Service({ eventStore });

    return {
        logger,
        v1Service,
    };
};

module.exports = createConfig;
