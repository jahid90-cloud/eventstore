const Bluebird = require('bluebird');

const ValidationError = require('../../../errors/validation-error');

const extractAttributes = require('./extract-attributes');
const validateMessage = require('./validate-message');
const handleSuccess = require('./handle-success');
const handleValidationFailure = require('./handle-validation-failure');
const handleFailure = require('./handle-failure');

const createActions = ({ config, eventStore }) => {
    const writeStreamMessage = (c) => {
        return eventStore.write(c.attributes).then(() => c);
    };

    return {
        writeStreamMessage,
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
