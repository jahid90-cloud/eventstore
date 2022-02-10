const extractAttributes = (c) => {
    c.attributes = { message: c.request.getMessage() };
    return c;
};

module.exports = extractAttributes;
