const { v4: uuid } = require('uuid');

const writeLoggedInEvent = (context) => {
    const event = {
        id: uuid(),
        type: 'UserLoggedIn',
        streamName: `authentication-${context.userCredential.id}`,
        metadata: {
            traceId: context.traceId,
            userId: context.userCredential.id,
        },
        data: {
            userId: context.userCredential.id,
        },
    };

    return context.services.eventStore
        .writeMessage(event)
        .then(() => context)
        .catch(({ status, statusText, data }) => {
            console.error(status, statusText, data);
            return context;
        });
};

module.exports = writeLoggedInEvent;
