const ApiError = require('../../../errors/api-error');
const { HTTP_STATUS_BAD_REQUEST } = require('../utils/http-status');

const handleValidationFailure = (c, err) => {
    c.res.status(HTTP_STATUS_BAD_REQUEST).send(new ApiError(err.message, HTTP_STATUS_BAD_REQUEST));
    return c;
};

module.exports = handleValidationFailure;
