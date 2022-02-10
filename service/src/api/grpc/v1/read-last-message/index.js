const Bluebird = require('bluebird');

const extractAttributes = require('./extract-attributes');
const sanitizeMessage = require('./sanitize-message');
const convertToProtoMessage = require('./convert-to-proto-message');
const updateResponse = require('./update-response');
const handleSuccess = require('./handle-success');
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

const createHandlers = ({ config, queries }) => {
    const readLastMessage = (call, callback, context) => {
        context = {
            ...context,
            config,
            request: call.request,
            callback,
        };

        return Bluebird.resolve(context)
            .then(extractAttributes)
            .then(queries.readLastStreamMessage)
            .then(sanitizeMessage)
            .then(convertToProtoMessage)
            .then(updateResponse)
            .then(handleSuccess)
            .catch((err) => handleFailure(err, context));
    };

    return {
        readLastMessage,
    };
};

const createReadLastMessage = ({ config, eventStore }) => {
    const middlewares = createMiddlewares({ config });
    const queries = createQueries({ config, eventStore });
    const handlers = createHandlers({ config, queries });

    return {
        handlers,
        middlewares,
    };
};

module.exports = createReadLastMessage;
