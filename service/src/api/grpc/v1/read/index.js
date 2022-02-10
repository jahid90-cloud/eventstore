const Bluebird = require('bluebird');

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

const createHandlers = ({ config, queries }) => {
    const read = (call, callback, context) => {
        context = {
            ...context,
            config,
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
    const handlers = createHandlers({ config, queries });

    return {
        handlers,
        middlewares,
    };
};

module.exports = createRead;
