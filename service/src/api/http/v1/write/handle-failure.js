const ApiError = require('../../../errors/api-error');
const { HTTP_STATUS_BAD_REQUEST } = require('../utils/http-status');

const handleFailure = (c, err) => {
    if (err.message && err.message.includes('duplicate key')) {
        c.res.status(HTTP_STATUS_BAD_REQUEST).send(new ApiError('Message with duplicate id', HTTP_STATUS_BAD_REQUEST));
    } else {
        c.next(err);
    }
};

module.exports = handleFailure;
