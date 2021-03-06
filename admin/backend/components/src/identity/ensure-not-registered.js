const AlreadyRegisteredError = require('./already-registered-error');

const ensureNotRegistered = (context) => {
    if (context.identity.isRegistered) {
        throw new AlreadyRegisteredError();
    }

    return context;
};

module.exports = ensureNotRegistered;
