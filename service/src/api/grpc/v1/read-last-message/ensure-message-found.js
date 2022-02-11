const NotFoundError = require('../../../errors/not-found-error');

const ensureMessageFound = (c) => {
    if (!c.result.message) {
        throw new NotFoundError('no message found');
    }
    return c;
};

module.exports = ensureMessageFound;
