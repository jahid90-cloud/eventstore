const extractAttributes = (c) => {
    const { id, type, streamName, data = {}, metadata = {} } = req.body;
    c.attributes = {
        id,
        type,
        streamName,
        data,
        metadata: {
            ...metadata,
            evsTraceId: (c.req.context && c.req.context.traceId) || 'None',
        },
    };
    return c;
};

module.exports = extractAttributes;
