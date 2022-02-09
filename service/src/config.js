const createLogger = require('./logger');

const createPostgresClient = require('./postgres-client');
const createEventStore = require('../lib/event-store');

const createPingService = require('./ping');
const createV1HttpService = require('./api/http/v1');
const createV1GrpcService = require('./api/grpc/v1');

const createConfig = ({ env }) => {
    const logger = createLogger({ env });
    const config = {
        env,
        logger,
    };

    const postgresClient = createPostgresClient({ config });
    const eventStore = createEventStore({ config, db: postgresClient });

    const pingService = createPingService({ config });
    const v1HttpService = createV1HttpService({ config, eventStore });
    const v1GrpcService = createV1GrpcService({ config, eventStore });

    return {
        ...config,
        pingService,
        v1HttpService,
        v1GrpcService,
    };
};

module.exports = createConfig;
