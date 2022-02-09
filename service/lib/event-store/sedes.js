const createSedes = ({ config }) => {
    const deserialize = (message) => {
        if (!message) return message;

        return {
            id: message.id,
            type: message.type,
            streamName: message.stream_name,
            data: JSON.parse(message.data),
            metadata: JSON.parse(message.metadata),
        };
    };

    return {
        deserialize,
    };
};

module.exports = createSedes;
