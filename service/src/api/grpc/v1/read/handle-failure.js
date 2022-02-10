const ApiError = require('../../../errors/api-error');

const handleFailure = (err, c) => {
    c.callback(new ApiError(err.message, 500), null);
    return c;
};

module.exports = handleFailure;
