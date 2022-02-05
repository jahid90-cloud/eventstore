const createReadLastMessage = ({ config, eventStore }) => {
    const readLastMessage = (req, res) => {
        const streamName = req.params.streamName;
        return eventStore.readLastMessage({ streamName }).then((message) => res.json(message));
    };

    return readLastMessage;
};

module.exports = createReadLastMessage;
