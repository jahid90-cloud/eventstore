const camelcaseKeys = require('camelcase-keys');
const { v4: uuid } = require('uuid');

const createMessageActions = ({ mdb, services }) => {
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

    return {
        resendMessage,
        deleteMessage,
        deleteAllMessages,
    };
};

module.exports = createMessageActions;
