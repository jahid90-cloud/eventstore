const hydrateMetadata = (c) => {
    c.attributes.message.metadata.evsTraceId = c.traceId;
    return c;
};

module.exports = hydrateMetadata;
