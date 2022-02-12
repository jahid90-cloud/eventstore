const positionResetProjection = require('./position-reset-projection');

const loadPositionReset = (context) => {
    const messageStore = context.messageStore;
    const command = context.command;
    const subscriberResetsStreamName = `subscriberPosition-${command.metadata.subscriberId}`;

    return messageStore
        .fetch(subscriberResetsStreamName, positionResetProjection)
        .then((positionReset) => {
            context.positionReset = positionReset;
            return context;
        });
};

module.exports = loadPositionReset;
