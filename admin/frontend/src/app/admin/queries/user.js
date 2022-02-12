const camelCaseKeys = require('camelcase-keys');

const createUserQueries = ({ db, mdb }) => {
    const user = (id) => {
        return db
            .then((client) => client('admin_users').where({ id }))
            .then(camelCaseKeys)
            .then((rows) => rows[0]);
    };

    const usersIndex = () => {
        return db
            .then((client) => client('admin_users').orderBy('email', 'ASC'))
            .then(camelCaseKeys);
    };

    const userLoginEvents = (userId) => {
        return mdb
            .then((client) =>
                client('messages').where({
                    stream_name: `authentication-${userId}`,
                })
            )
            .then(camelCaseKeys);
    };

    const userMessages = (userId, isEvsContext) => {
        const metaField = isEvsContext ? 'evs_clientId' : 'userId';

        return mdb
            .then((client) =>
                client('messages')
                    .whereRaw('metadata->>? = ?', [metaField, userId])
                    .orderBy('global_position', 'asc')
            )
            .then(camelCaseKeys);
    };

    return {
        user,
        usersIndex,
        userLoginEvents,
        userMessages,
    };
};

module.exports = createUserQueries;
