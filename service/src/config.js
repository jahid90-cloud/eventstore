const createLogger = require('./logger');

const createPostgresClient = require('./postgres-client');
const createEventStore = require('../lib/event-store');

const createPingService = require('./ping');
const createV1Service = require('./api/v1');

const createConfig = ({ env }) => {
    const logger = createLogger({ env });
    const config = {
        env,
        logger,
    };

    const postgresClient = createPostgresClient({ config });
    const eventStore = createEventStore({ config, db: postgresClient });

    const pingService = createPingService({ config });
    const v1Service = createV1Service({ config, eventStore });

    return {
        ...config,
        pingService,
        v1Service,
    };
};

module.exports = createConfig;
