const Bluebird = require('bluebird');

const ValidationError = require('../../../errors/validation-error');

const extractAttributes = require('./extract-attributes');
const deserialize = require('./deserialize');
const validateMessage = require('./validate-message');
const hydrateMetadata = require('./hydrate-metadata');
const handleSuccess = require('./handle-success');

const createMiddlewares = ({ config }) => {
    const attachResponseMiddleware = {
        apply: (handler) => {
            return (call, callback, context) => {
                const res = new context.proto.WriteResponse();

                context = context || {};
                context.response = res;

                return handler(call, callback, context);
            };
        },
    };

    return [attachResponseMiddleware];
};

const createActions = ({ config, eventStore }) => {
    const writeStreamMessage = (c) => {
        return eventStore.write(c.attributes.message).then(() => c);
    };

    return {
        writeStreamMessage,
    };
};

const createHandlers = ({ config, actions }) => {
    const write = (call, callback, context) => {
        context = {
            ...context,
            config,
            request: call.request,
            callback,
        };

        return Bluebird.resolve(context)
            .then(extractAttributes)
            .then(deserialize)
            .then(validateMessage)
            .then(hydrateMetadata)
            .then(actions.writeStreamMessage)
            .then(handleSuccess)
            .catch(ValidationError, (err) => handleValidationFailure(err, context))
            .catch((err) => handleFailure(err, context));
    };

    return {
        write,
    };
};

const createWrite = ({ config, eventStore }) => {
    const middlewares = createMiddlewares({ config });
    const actions = createActions({ config, eventStore });
    const handlers = createHandlers({ config, actions });

    return {
        handlers,
        middlewares,
    };
};

module.exports = createWrite;
