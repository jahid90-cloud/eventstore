const { v4: uuid } = require('uuid');

const ServiceError = require('../../errors/service-error');

const writeRegisterCommand = (context) => {
    const userId = context.attributes.id;
    const command = {
        id: uuid(),
        type: 'Register',
        streamName: `identity:command-${userId}`,
        metadata: {
            traceId: context.traceId,
            userId,
        },
        data: {
            userId,
            email: context.attributes.email,
            passwordHash: context.passwordHash,
        },
    };

    return context.services.eventStore
        .writeMessage(command)
        .then(() => context)
        .catch((res) => {
            const { status, statusText, data } = res.response;
            console.error(status, statusText, data);
            throw new ServiceError(statusText);
        });
};

module.exports = writeRegisterCommand;
