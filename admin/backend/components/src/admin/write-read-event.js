const { v4: uuid } = require('uuid');

const writeReadEvent = (context) => {
    const { command, messageStore } = context;

    const event = {
        id: uuid(),
        type: 'Read',
        metadata: {
            traceId: command.metadata.traceId,
            userId: command.metadata.userId,
        },
        data: {
            position: command.data.position,
            lastMessageId: command.data.lastMessageId,
        },
    };
    const streamName = `subscriberPosition-${command.metadata.subscriberId}`;

    return messageStore
        .write(streamName, event)
        .then(() => context)
        .catch((err) => {
            const { status, statusText, data } = err.response;
            console.error(status, statusText, data);
            // Failed to write the workflow event; rethrow to indicate flow failure
            throw err;
        });
};

module.exports = writeReadEvent;
