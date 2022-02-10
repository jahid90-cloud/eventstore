const sanitize = require('../utils/sanitize');

const sanitizeMessages = (c) => {
    c.result = { messages: c.result.messages.map(sanitize) };
    return c;
};

module.exports = sanitizeMessages;
