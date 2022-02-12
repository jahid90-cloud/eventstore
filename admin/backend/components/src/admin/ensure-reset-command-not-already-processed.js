const CommandAlreadyProcessedError = require('./command-already-processed-error');

const ensureResetCommandNotAlreadyProcessed = (context) => {
    const { positionReset, command } = context;

    if (positionReset.sequence > command.globalPosition) {
        throw new CommandAlreadyProcessedError();
    }

    return context;
};

module.exports = ensureResetCommandNotAlreadyProcessed;
