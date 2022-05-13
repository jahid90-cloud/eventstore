const { v4: uuid } = require('uuid');

const createSubscriberActions = ({ services }) => {
    const resetSubscriberPosition = (context) => {
        const { traceId, userId, subscriberId } = context;

        const resetCommand = {
            id: uuid(),
            type: 'ResetPosition',
            streamName: `subscriberPosition:command-${subscriberId}`,
            metadata: {
                traceId,
                userId,
                subscriberId,
            },
            data: {
                position: 0,
                lastMessageId: null,
            },
        };

        return services.eventStore
            .writeMessage(resetCommand)
            .then(() => context)
            .catch((err) => {
                const { status, statusText, data } = err.response;
                console.error(status, statusText, data);
            });
    };

    return {
        resetSubscriberPosition,
    };
};

module.exports = createSubscriberActions;
