const Bluebird = require('bluebird');
const { v4: uuid } = require('uuid');

const ValidationError = require('../../../errors/validation-error');
const sanitize = require('../utils/sanitize');

const extractAttributes = require('./extract-attributes');
const deserialize = require('./deserialize');
const validateMessage = require('./validate-message');
const hydrateMetadata = require('./hydrate-metadata');
const handleSuccess = require('./handle-success');
const handleFailure = require('./handle-failure');
const handleValidationFailure = require('./handle-validation-failure');

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

    const writeSuccessEvent = (c) => {
        const { evs_traceId, evs_clientId } = c;
        const event = {
            id: uuid(),
            type: 'WriteSuccess',
            streamName: `client-${evs_clientId}`,
            data: {
                messageId: c.attributes.message.id,
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
            type: 'WriteFailed',
            streamName: `client-${evs_clientId}`,
            data: {
                message: sanitize(c.attributes.message),
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
        writeStreamMessage,
        writeSuccessEvent,
        writeFailedEvent,
    };
};

const createHandlers = ({ config, actions }) => {
    const write = (call, callback, context) => {
        context = {
            ...context,
            config,
            actions,
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
            .catch(ValidationError, (err) => handleValidationFailure(context, err))
            .catch((err) => handleFailure(context, err));
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
