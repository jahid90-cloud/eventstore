const Bluebird = require('bluebird');
const camelcaseKeys = require('camelcase-keys');
const { v4: uuid } = require('uuid');

const createActions = ({ db, mdb, services }) => {
    const resendMessage = (messageId) => {
        return mdb
            .then((client) =>
                client('messages').where({ id: messageId }).limit(1)
            )
            .then(camelcaseKeys)
            .then((rows) => rows[0])
            .then((message) => {
                const messageCopy = {
                    id: uuid(),
                    type: message.type,
                    streamName: message.streamName,
                    metadata: {
                        ...message.metadata,
                        copyOf: message.id,
                    },
                    data: message.data || {},
                };

                return services.eventStore.writeMessage(messageCopy);
            })
            .catch(({ status, statusText, data }) =>
                console.error(status, statusText, data)
            );
    };

    const clearView = (view) => {
        return db.then((client) => client(view).delete());
    };

    const clearAllViews = (views) => {
        return Bluebird.resolve(views)
            .then((views) => views.map((view) => view.name))
            .then((views) => views.map(clearView));
    };

    const deleteMessage = (id) => {
        return mdb.then((client) => client('messages').delete().where({ id }));
    };

    const deleteAllMessages = (ids) => {
        return mdb
            .then((client) =>
                client('messages').delete().whereRaw('id = ANY(?)', [ids])
            )
            .catch(console.error);
    };

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
        resendMessage,
        clearView,
        clearAllViews,
        deleteMessage,
        deleteAllMessages,
        resetSubscriberPosition,
    };
};

module.exports = createActions;
