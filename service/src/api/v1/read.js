const createRead = ({ config, eventStore }) => {
    const sanitizeResponse = (messages) => {
        return messages.map((message) => {
            message.metadata && message.metadata.evsTraceId && delete message.metadata.evsTraceId;
            return message;
        });
    };

    const read = (req, res) => {
        const streamName = req.params.streamName;
        return eventStore
            .read({ streamName })
            .then(sanitizeResponse)
            .then((messages) => res.json(messages));
    };

    return read;
};

module.exports = createRead;
