const camelCaseKeys = require('camelcase-keys');

const createMessageQueries = ({ mdb }) => {
    const message = (id) => {
        return mdb
            .then((client) =>
                client('messages')
                    .where({ id })
                    .orderBy('global_position', 'asc')
            )
            .then((rows) => rows[0])
            .then(camelCaseKeys);
    };

    const messages = () => {
        return mdb
            .then((client) =>
                client('messages').orderBy('global_position', 'asc')
            )
            .then(camelCaseKeys);
    };

    const correlatedMessages = (traceId, isEvsContext) => {
        const metaField = isEvsContext ? 'evs_traceId' : 'traceId';

        return mdb
            .then((client) =>
                client('messages')
                    .whereRaw('metadata->>? = ?', [metaField, traceId])
                    .orderBy('global_position', 'asc')
            )
            .then(camelCaseKeys);
    };

    return {
        message,
        messages,
        correlatedMessages,
    };
};

module.exports = createMessageQueries;
