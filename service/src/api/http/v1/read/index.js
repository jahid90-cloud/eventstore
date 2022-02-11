const Bluebird = require('bluebird');
const { v4: uuid } = require('uuid');

const NotFoundError = require('../../../errors/not-found-error');

const extractAttributes = require('./extract-attributes');
const ensureMessagesFound = require('./ensure-messages-found');
const sanitizeMessages = require('./sanitize-messages');
const handleSuccess = require('./handle-success');
const handleNotFoundFailure = require('./handle-not-found-failure');
const handleFailure = require('./handle-failure');

const createActions = ({ config, eventStore }) => {
    const writeSuccessEvent = (c) => {
        const { evs_traceId, evs_clientId } = c.req.context;
        const event = {
            id: uuid(),
            type: 'ReadSuccess',
            streamName: `client-${evs_clientId}`,
            data: {
                queriedStream: c.attributes.streamName,
            },
            metadata: {
                evs_traceId,
                evs_clientId,
            },
        };

        return eventStore
            .write(event)
            .then(() => c)
            .catch((err) => {
                console.log(err.message);
                // Failure to write success event should not affect api flow
                return c;
            });
    };

    const writeNotFoundEvent = (c, err) => {
        const { evs_traceId, evs_clientId } = c.req.context;
        const event = {
            id: uuid(),
            type: 'ReadNotFound',
            streamName: `client-${evs_clientId}`,
            data: {
                queriedStream: c.attributes.streamName,
                reason: err.message,
            },
            metadata: {
                evs_traceId,
                evs_clientId,
            },
        };

        return eventStore
            .write(event)
            .then(() => c)
            .catch((err) => {
                console.log(err.message);
                // Failure to write success event should not affect api flow
                return c;
            });
    };

    const writeFailedEvent = (c, err) => {
        const { evs_traceId, evs_clientId } = c.req.context;
        const event = {
            id: uuid(),
            type: 'ReadFailed',
            streamName: `client-${evs_clientId}`,
            data: {
                queriedStream: c.attributes.streamName,
                reason: err.message,
            },
            metadata: {
                evs_traceId,
                evs_clientId,
            },
        };

        return eventStore
            .write(event)
            .then(() => c)
            .catch((err) => {
                console.log(err.message);
                // Failure to write success event should not affect api flow
                return c;
            });
    };

    return {
        writeSuccessEvent,
        writeNotFoundEvent,
        writeFailedEvent,
    };
};

const createQueries = ({ config, eventStore }) => {
    const readStreamMessages = (c) => {
        return eventStore.read(c.attributes).then((messages) => {
            c.result = { messages };
            return c;
        });
    };

    return {
        readStreamMessages,
    };
};

const createHandlers = ({ config, queries, actions }) => {
    const read = (req, res, next) => {
        const context = {
            config,
            queries,
            actions,
            req,
            res,
            next,
        };

        return Bluebird.resolve(context)
            .then(extractAttributes)
            .then(queries.readStreamMessages)
            .then(ensureMessagesFound)
            .then(sanitizeMessages)
            .then(handleSuccess)
            .catch(NotFoundError, (err) => handleNotFoundFailure(context, err))
            .catch((err) => handleFailure(context, err));
    };

    return {
        read,
    };
};

const createRead = ({ config, eventStore }) => {
    const queries = createQueries({ config, eventStore });
    const actions = createActions({ config, eventStore });
    const handlers = createHandlers({ config, queries, actions });

    return {
        handlers,
    };
};

module.exports = createRead;
