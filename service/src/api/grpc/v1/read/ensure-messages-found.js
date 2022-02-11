const NotFoundError = require('../../../errors/not-found-error');

const ensureMessagesFound = (c) => {
    if (!c.result.messages || (Array.isArray(c.result.messages) && c.result.messages.length === 0)) {
        throw new NotFoundError('no messages found');
    }
    return c;
};

module.exports = ensureMessagesFound;
