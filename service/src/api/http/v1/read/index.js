const Bluebird = require('bluebird');

const NotFoundError = require('../../../errors/not-found-error');

const extractAttributes = require('./extract-attributes');
const ensureMessagesFound = require('./ensure-messages-found');
const sanitizeMessages = require('./sanitize-messages');
const handleSuccess = require('./handle-success');

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
    const read = (req, res, next) => {
        const context = {
            config,
            queries,
            req,
            res,
            next,
        };

        return Bluebird.resolve(context)
            .then(extractAttributes)
            .then(queries.readStreamMessages)
            .then(ensureMessagesFound)
            .then(sanitizeMessages)
            .then(handleSuccess)
            .catch(NotFoundError, (err) => handleNotFoundFailure(context, err))
            .catch(next);
    };

    return {
        read,
    };
};

const createRead = ({ config, eventStore }) => {
    const queries = createQueries({ config, eventStore });
    const handlers = createHandlers({ config, queries });

    return {
        handlers,
    };
};

module.exports = createRead;
