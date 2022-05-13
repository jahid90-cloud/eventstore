const { v4: uuid } = require('uuid');

const handleUserNotFound = (context) => {
    const event = {
        id: uuid(),
        type: 'UserNotFound',
        streamName: `identity-${context.userId}`,
        data: {
            email: context.email,
        },
        metadata: {
            userId: context.userId,
            traceId: context.traceId,
        },
    };

    return context.services.eventService
        .writeMessage(event)
        .then(() => context)
        .catch(({ status, statusText, data }) =>
            console.error(status, statusText, data)
        );
};

module.exports = handleUserNotFound;
