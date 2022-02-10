const sanitize = require('../utils/sanitize');

const sanitizeMessage = (c) => {
    c.result = { message: sanitize(c.result.message) };
    return c;
};

module.exports = sanitizeMessage;
