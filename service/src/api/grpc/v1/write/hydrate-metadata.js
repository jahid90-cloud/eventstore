const hydrateMetadata = (c) => {
    const { evs_traceId, evs_clientId } = c;
    c.attributes.message.metadata = {
        ...c.attributes.message.metadata,
        evs_traceId,
        evs_clientId,
    };
    return c;
};

module.exports = hydrateMetadata;
