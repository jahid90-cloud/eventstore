const extractAttributes = (c) => {
    const { id, type, streamName, data = {}, metadata = {} } = c.req.body;
    const { evs_traceId, evs_clientId } = c.req.context;
    c.attributes = {
        id,
        type,
        streamName,
        data,
        metadata: {
            ...metadata,
            evs_traceId,
            evs_clientId,
        },
    };
    return c;
};

module.exports = extractAttributes;
