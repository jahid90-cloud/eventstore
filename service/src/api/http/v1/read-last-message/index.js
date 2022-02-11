const Bluebird = require('bluebird');

const NotFoundError = require('../../../errors/not-found-error');

const extractAttributes = require('./extract-attributes');
const ensureMessageFound = require('./ensure-message-found');
const sanitizeMessage = require('./sanitize-message');
const handleSuccess = require('./handle-success');

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
    const readLastMessage = (req, res, next) => {
        const context = {
            config,
            queries,
            req,
            res,
            next,
        };

        return Bluebird.resolve(context)
            .then(extractAttributes)
            .then(queries.readLastStreamMessage)
            .then(ensureMessageFound)
            .then(sanitizeMessage)
            .then(handleSuccess)
            .catch(NotFoundError, (err) => handleNotFoundFailure(context, err))
            .catch(next);
    };

    return {
        readLastMessage,
    };
};

const createReadLastMessage = ({ config, eventStore }) => {
    const queries = createQueries({ config, eventStore });
    const handlers = createHandlers({ config, queries });

    return {
        handlers,
    };
};

module.exports = createReadLastMessage;
