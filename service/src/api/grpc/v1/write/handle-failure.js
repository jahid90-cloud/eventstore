const ApiError = require('../../../errors/api-error');

const handleFailure = (err, c) => {
    if (err.message && err.message.includes('duplicate key')) {
        c.callback(new ApiError('Message with duplicate id', 400), null);
    } else {
        c.callback(new ApiError(err.message, 500), null);
    }
    return c;
};

module.exports = handleFailure;
