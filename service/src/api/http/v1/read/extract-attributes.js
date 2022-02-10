const extractAttributes = (c) => {
    c.attributes = { streamName: c.req.params.streamName };
    return c;
};

module.exports = extractAttributes;
