const { HTTP_STATUS_ACCEPTED } = require('../utils/http-status');

const handleSuccess = (c) => {
    c.res.sendStatus(HTTP_STATUS_ACCEPTED);
    return c.actions.writeSuccessEvent(c);
};

module.exports = handleSuccess;
