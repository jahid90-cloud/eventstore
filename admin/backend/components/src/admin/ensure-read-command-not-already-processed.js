const CommandAlreadyProcessedError = require('./command-already-processed-error');

const ensureReadCommandNotAlreadyProcessed = (context) => {
    const { subscriberPosition, command } = context;

    if (subscriberPosition.sequence > command.globalPosition) {
        throw new CommandAlreadyProcessedError();
    }

    return context;
};

module.exports = ensureReadCommandNotAlreadyProcessed;
