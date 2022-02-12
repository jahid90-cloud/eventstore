const { v4: uuid } = require('uuid');

const writePositionResetFailedEvent = (context, err) => {
    const { command, messageStore } = context;

    const event = {
        id: uuid(),
        type: 'PositionResetFailed',
        metadata: {
            traceId: command.metadata.traceId,
            userId: command.metadata.userId,
            subscriberId: command.metadata.subscriberId,
        },
        data: {
            messageId: command.id,
            reason: err.message,
        },
    };
    const streamName = `subscriberPosition-${command.data.subscriberId}`;

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

module.exports = writePositionResetFailedEvent;
