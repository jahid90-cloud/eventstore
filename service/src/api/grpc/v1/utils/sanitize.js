const sanitize = (message) => {
    message.metadata &&
        Object.entries(message.metadata).forEach(([key, value]) => {
            if (key.startsWith('evs-')) {
                delete message.metadata[key];
            }
        });
    return message;
};

module.exports = sanitize;
