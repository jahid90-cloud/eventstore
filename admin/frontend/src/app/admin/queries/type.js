const camelCaseKeys = require('camelcase-keys');

const createTypeQueries = ({ db, mdb }) => {
    const messagesByType = (type) => {
        return mdb
            .then((client) =>
                client('messages')
                    .whereRaw('type LIKE ?', [type])
                    .orderBy('global_position', 'asc')
            )
            .then(camelCaseKeys);
    };

    const eventTypes = () => {
        return db
            .then((client) =>
                client('admin_event_types')
                    .orderBy('type', 'ASC')
                    .orderBy('stream_name', 'ASC')
            )
            .then(camelCaseKeys);
    };

    return {
        messagesByType,
        eventTypes,
    };
};

module.exports = createTypeQueries;
