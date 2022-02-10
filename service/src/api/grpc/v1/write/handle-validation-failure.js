const ApiError = require('../../../errors/api-error');

const handleValidationFailure = (err, c) => {
    c.callback(new ApiError(err.message, 400));
    return c.actions.writeFailedEvent(c, err);
};

module.exports = handleValidationFailure;
