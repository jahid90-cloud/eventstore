const { HTTP_STATUS_NOT_FOUND } = require('../utils/http-status');

const handleFailure = (c, err) => {
    c.next(err);
    return c.actions.writeFailedEvent(c, err);
};

module.exports = handleFailure;
