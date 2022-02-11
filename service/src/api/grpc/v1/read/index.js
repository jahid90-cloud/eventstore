const Bluebird = require('bluebird');
const { v4: uuid } = require('uuid');

const NotFoundError = require('../../../errors/not-found-error');

const extractAttributes = require('./extract-attributes');
const ensureMessagesFound = require('./ensure-messages-found');
const sanitizeMessages = require('./sanitize-messages');
const convertToProtoMessages = require('./convert-to-proto-messages');
const updateResponse = require('./update-response');
const handleSuccess = require('./handle-success');
const handleNotFoundFailure = require('./handle-not-found-failure');
const handleFailure = require('./handle-failure');

const createMiddlewares = ({ config }) => {
    const attachResponseMiddleware = {
        apply: (handler) => {
            return (call, callback, context) => {
                const res = new context.proto.ReadResponse();
                res.setMessagesList(null);

                context = context || {};
                context.response = res;

                handler(call, callback, context);
            };
        },
    };

    return [attachResponseMiddleware];
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

const createActions = ({ config, eventStore }) => {
    const writeSuccessEvent = (c) => {
        const { evs_traceId, evs_clientId } = c;
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

        return eventStore.write(event).then(() => c);
    };

    const writeFailedEvent = (c, err) => {
        const { evs_traceId, evs_clientId } = c;
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

        return eventStore.write(event).then(() => c);
    };

    const writeNotFoundEvent = (c, err) => {
        const { evs_traceId, evs_clientId } = c;
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

        return eventStore.write(event).then(() => c);
    };

    return {
        writeSuccessEvent,
        writeFailedEvent,
        writeNotFoundEvent,
    };
};

const createHandlers = ({ config, queries, actions }) => {
    const read = (call, callback, context) => {
        context = {
            ...context,
            config,
            queries,
            actions,
            request: call.request,
            callback,
        };

        return Bluebird.resolve(context)
            .then(extractAttributes)
            .then(queries.readStreamMessages)
            .then(ensureMessagesFound)
            .then(sanitizeMessages)
            .then(convertToProtoMessages)
            .then(updateResponse)
            .then(handleSuccess)
            .then(NotFoundError, (err) => handleNotFoundFailure(context, err))
            .catch((err) => handleFailure(context, err));
    };

    return {
        read,
    };
};

const createRead = ({ config, eventStore }) => {
    const middlewares = createMiddlewares({ config });
    const queries = createQueries({ config, eventStore });
    const actions = createActions({ config, eventStore });
    const handlers = createHandlers({ config, queries, actions });

    return {
        handlers,
        middlewares,
    };
};

module.exports = createRead;
