const ApiError = require('../../../errors/api-error');

const handleFailure = (err, c) => {
    c.callback(new ApiError(err.message, 500), null);
    return c.actions.writeFailedEvent(c, err);
};

module.exports = handleFailure;
