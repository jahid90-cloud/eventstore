const { v4: uuid } = require('uuid');

const AuthenticationError = require('../../errors/authentication-error');

const handleCredentialMismatch = (context) => {
    const event = {
        id: uuid(),
        type: 'UserLoginFailed',
        streamName: `authentication-${context.userCredential.id}`,
        metadata: {
            traceId: context.traceId,
            userId: null,
        },
        data: {
            userId: context.userCredential.id,
            reason: 'Incorrect password',
        },
    };

    return context.services.eventStore.writeMessage(event).then(() => {
        throw new AuthenticationError();
    });
};

module.exports = handleCredentialMismatch;
