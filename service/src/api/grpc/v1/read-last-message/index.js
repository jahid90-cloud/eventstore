const Bluebird = require('bluebird');
const { v4: uuid } = require('uuid');

const NotFoundError = require('../../../errors/not-found-error');

const extractAttributes = require('./extract-attributes');
const ensureMessageFound = require('./ensure-message-found');
const sanitizeMessage = require('./sanitize-message');
const convertToProtoMessage = require('./convert-to-proto-message');
const updateResponse = require('./update-response');
const handleSuccess = require('./handle-success');
const handleNotFoundFailure = require('./handle-not-found-failure');
const handleFailure = require('./handle-failure');

const createMiddlewares = ({ config }) => {
    const attachResponseMiddleware = {
        apply: (handler) => {
            return (call, callback, context) => {
                const res = new context.proto.LastResponse();
                res.setMessage(null);

                context = context || {};
                context.response = res;

                handler(call, callback, context);
            };
        },
    };

    return [attachResponseMiddleware];
};

const createQueries = ({ config, eventStore }) => {
    const readLastStreamMessage = (c) => {
        return eventStore.readLastMessage(c.attributes).then((message) => {
            c.result = { message };
            return c;
        });
    };

    return {
        readLastStreamMessage,
    };
};

const createActions = ({ config, eventStore }) => {
    const writeSuccessEvent = (c) => {
        const clientId = c.clientId;
        const event = {
            id: uuid(),
            type: 'ReadLastSuccess',
            streamName: `client-${clientId}`,
            data: {
                queriedStream: c.attributes.streamName,
            },
            metadata: {
                clientId,
                traceId: c.traceId,
            },
        };

        return eventStore.write(event).then(() => c);
    };

    const writeFailedEvent = (c, err) => {
        const clientId = c.clientId;
        const event = {
            id: uuid(),
            type: 'ReadLastFailed',
            streamName: `client-${clientId}`,
            data: {
                queriedStream: c.attributes.streamName,
                reason: err.message,
            },
            metadata: {
                clientId,
                traceId: c.traceId,
            },
        };

        return eventStore.write(event).then(() => c);
    };

    const writeNotFoundEvent = (c, err) => {
        const clientId = c.clientId;
        const event = {
            id: uuid(),
            type: 'ReadLastNotFound',
            streamName: `client-${clientId}`,
            data: {
                queriedStream: c.attributes.streamName,
                reason: err.message,
            },
            metadata: {
                clientId,
                traceId: c.traceId,
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
    const readLastMessage = (call, callback, context) => {
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
            .then(queries.readLastStreamMessage)
            .then(ensureMessageFound)
            .then(sanitizeMessage)
            .then(convertToProtoMessage)
            .then(updateResponse)
            .then(handleSuccess)
            .catch(NotFoundError, (err) => handleNotFoundFailure(context, err))
            .catch((err) => handleFailure(context, err));
    };

    return {
        readLastMessage,
    };
};

const createReadLastMessage = ({ config, eventStore }) => {
    const middlewares = createMiddlewares({ config });
    const queries = createQueries({ config, eventStore });
    const actions = createActions({ config, eventStore });
    const handlers = createHandlers({ config, queries, actions });

    return {
        handlers,
        middlewares,
    };
};

module.exports = createReadLastMessage;
