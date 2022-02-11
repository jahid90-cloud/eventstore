const { v4: uuid } = require('uuid');

const writeAdminPrivilegeRemovedEvent = (context) => {
    const event = {
        id: uuid(),
        type: 'AdminPrivilegeRemoved',
        streamName: `identity-${context.user.id}`,
        metadata: {
            traceId: context.traceId,
            userId: context.user.id,
        },
        data: {
            userId: context.user.id,
        },
    };

    return context.services.eventStore.writeMessage(event).then(() => context);
};

module.exports = writeAdminPrivilegeRemovedEvent;
