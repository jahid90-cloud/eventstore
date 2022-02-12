const { v4: uuid } = require('uuid');

const writePositionResetEvent = (context) => {
    const { command, messageStore } = context;

    const event = {
        id: uuid(),
        type: 'PositionReset',
        metadata: {
            traceId: command.metadata.traceId,
            userId: command.metadata.userId,
            subscriberId: command.data.subscriberId,
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
            // Don't let flow fail because of tracing event
            return context;
        });
};

module.exports = writePositionResetEvent;
