const Bluebird = require('bluebird');
const { v4: uuid } = require('uuid');

const extractAttributes = require('./extract-attributes');
const sanitizeMessages = require('./sanitize-messages');
const convertToProtoMessages = require('./convert-to-proto-messages');
const updateResponse = require('./update-response');
const handleSuccess = require('./handle-success');
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
        const clientId = c.clientId;
        const event = {
            id: uuid(),
            type: 'Read',
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
            type: 'ReadFailed',
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
            .then(sanitizeMessages)
            .then(convertToProtoMessages)
            .then(updateResponse)
            .then(handleSuccess)
            .catch((err) => handleFailure(err, context));
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
