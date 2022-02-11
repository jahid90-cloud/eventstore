const ApiError = require('../../../errors/api-error');

const handleNotFoundFailure = (c, err) => {
    c.callback(new ApiError(err.message, 404), null);
    return c.actions.writeNotFoundEvent(c, err);
};

module.exports = handleNotFoundFailure;
