const extractAttributes = (c) => {
    c.attributes = {
        streamName: c.request.getStreamname(),
    };
    return c;
};

module.exports = extractAttributes;
