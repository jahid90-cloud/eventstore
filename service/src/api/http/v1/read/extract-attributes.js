const extractAttributes = (c) => {
    console.log(c.req.params);
    c.attributes = { streamName: c.req.params.streamName };
    return c;
};

module.exports = extractAttributes;
