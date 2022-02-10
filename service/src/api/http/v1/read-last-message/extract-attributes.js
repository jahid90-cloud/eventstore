const extractAttributes = (c) => {
    c.attributes = { streamName: c.req.params.streamName };
};

module.exports = extractAttributes;
