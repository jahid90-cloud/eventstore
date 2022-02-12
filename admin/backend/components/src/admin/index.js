const Bluebird = require('bluebird');

const env = require('../env');
const CommandAlreadyProcessedError = require('./command-already-processed-error');

const loadSubscriberPosition = require('./load-subscriber-position');
const ensureReadCommandNotAlreadyProcessed = require('./ensure-read-command-not-already-processed');
const writeReadEvent = require('./write-read-event');
const writeReadFailedEvent = require('./write-read-failed-event');
const loadPositionReset = require('./load-position-reset');
const ensureResetCommandNotAlreadyProcessed = require('./ensure-reset-command-not-already-processed');
const writePositionResetEvent = require('./write-position-reset-event');
const writePositionResetFailedEvent = require('./write-position-reset-failed-event');

const createHandlers = ({ messageStore }) => {
    return {
        Read: (command) => {
            const context = {
                command,
                messageStore,
            };

            return Bluebird.resolve(context)
                .then(loadSubscriberPosition)
                .then(ensureReadCommandNotAlreadyProcessed)
                .then(writeReadEvent)
                .catch(CommandAlreadyProcessedError, () => {
                    env.enableDebug &&
                        console.debug(
                            `[${command.streamName}] skipping command: ${command.globalPosition}`
                        );
                })
                .catch((err) => writeReadFailedEvent(context, err));
        },
        ResetPosition: (command) => {
            const context = {
                command,
                messageStore,
            };

            return Bluebird.resolve(context)
                .then(loadPositionReset)
                .then(ensureResetCommandNotAlreadyProcessed)
                .then(writeReadEvent)
                .then(writePositionResetEvent)
                .catch(CommandAlreadyProcessedError, () => {
                    env.enableDebug &&
                        console.debug(
                            `[${command.streamName}] skipping command: ${command.globalPosition}`
                        );
                })
                .catch((err) => writePositionResetFailedEvent(context, err));
        },
    };
};

const build = ({ messageStore }) => {
    const handlers = createHandlers({ messageStore });
    const subscription = messageStore.createSubscription({
        streamName: 'subscriberPosition:command',
        handlers,
        subscriberId: 'components:admin',
    });

    const start = () => {
        return subscription.start();
    };

    return {
        handlers,
        start,
    };
};

module.exports = build;
