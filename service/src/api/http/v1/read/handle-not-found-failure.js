const { HTTP_STATUS_NOT_FOUND } = require('../utils/http-status');

const handleNotFoundFailure = (c, err) => {
    c.res.sendStatus(HTTP_STATUS_NOT_FOUND);
    return c.actions.writeNotFoundEvent(c, err);
};

module.exports = handleNotFoundFailure;
