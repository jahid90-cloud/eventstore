const camelCaseKeys = require('camelcase-keys');

const createEntityQueries = ({ db, mdb }) => {
    const entities = () => {
        return db
            .then((client) => client('admin_entities').orderBy('id', 'ASC'))
            .then(camelCaseKeys);
    };

    const entityMessages = (identityId) => {
        return mdb
            .then((client) =>
                client('messages')
                    .whereRaw('stream_name LIKE ?', ['%' + identityId])
                    .orderBy('global_position', 'asc')
            )
            .then(camelCaseKeys);
    };

    return {
        entities,
        entityMessages,
    };
};

module.exports = createEntityQueries;
