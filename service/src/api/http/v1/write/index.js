const Bluebird = require('bluebird');
const { v4: uuid } = require('uuid');

const ValidationError = require('../../../errors/validation-error');
const sanitize = require('../utils/sanitize');

const extractAttributes = require('./extract-attributes');
const validateMessage = require('./validate-message');
const handleSuccess = require('./handle-success');
const handleValidationFailure = require('./handle-validation-failure');
const handleFailure = require('./handle-failure');

const createActions = ({ config, eventStore }) => {
    const writeStreamMessage = (c) => {
        return eventStore.write(c.attributes).then(() => c);
    };

    const writeSuccessEvent = (c) => {
        const { evs_traceId, evs_clientId } = c.req.context;
        const event = {
            id: uuid(),
            type: 'WriteSuccess',
            streamName: `client-${evs_clientId}`,
            data: {
                messageId: c.attributes.id,
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
                config.logger.error(err.message);
                // Failure to write success event should not affect api flow
                return c;
            });
    };

    const writeValidationFailedEvent = (c, err) => {
        const { evs_traceId, evs_clientId } = c.req.context;
        const event = {
            id: uuid(),
            type: 'WriteValidationFailed',
            streamName: `client-${evs_clientId}`,
            data: {
                message: sanitize(c.attributes),
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
                config.logger.error(err.message);
                // Failure to write success event should not affect api flow
                return c;
            });
    };

    const writeFailedEvent = (c, err) => {
        const { evs_traceId, evs_clientId } = c.req.context;
        const event = {
            id: uuid(),
            type: 'WriteFailed',
            streamName: `client-${evs_clientId}`,
            data: {
                message: sanitize(c.attributes),
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
                config.logger.error(err.message);
                // Failure to write success event should not affect api flow
                return c;
            });
    };

    return {
        writeStreamMessage,
        writeSuccessEvent,
        writeValidationFailedEvent,
        writeFailedEvent,
    };
};

const createHandlers = ({ config, actions }) => {
    const write = (req, res, next) => {
        const context = {
            config,
            actions,
            req,
            res,
            next,
        };

        return Bluebird.resolve(context)
            .then(extractAttributes)
            .then(validateMessage)
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
    const actions = createActions({ config, eventStore });
    const handlers = createHandlers({ config, actions });

    return {
        handlers,
    };
};

module.exports = createWrite;
