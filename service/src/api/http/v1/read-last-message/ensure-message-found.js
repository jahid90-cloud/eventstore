const NotFoundError = require('../../../errors/not-found-error');

const ensureMessageFound = (c) => {
    if (!c.result.message) {
        throw new NotFoundError();
    }
};

module.exports = ensureMessageFound;
