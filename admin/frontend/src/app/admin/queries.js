const Bluebird = require('bluebird');
const camelCaseKeys = require('camelcase-keys');

const createQueries = ({ db, mdb }) => {
    const usersIndex = () => {
        return db
            .then((client) => client('admin_users').orderBy('email', 'ASC'))
            .then(camelCaseKeys);
    };

    const user = (id) => {
        return db
            .then((client) => client('admin_users').where({ id }))
            .then(camelCaseKeys)
            .then((rows) => rows[0]);
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

    const streamName = (streamName) => {
        return mdb
            .then((client) =>
                client('messages')
                    .where({ stream_name: streamName })
                    .orderBy('global_position', 'asc')
            )
            .then(camelCaseKeys);
    };

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

    const streams = () => {
        return db
            .then((client) =>
                client('admin_streams').orderBy('stream_name', 'ASC')
            )
            .then(camelCaseKeys);
    };

    const subscriberPositions = () => {
        return db.then((client) =>
            client('admin_subscriber_positions').then(camelCaseKeys)
        );
    };

    const categories = () => {
        return db
            .then((client) =>
                client('admin_categories').orderBy('category_name', 'ASC')
            )
            .then(camelCaseKeys);
    };

    const categoryName = (categoryName) => {
        return mdb
            .then((client) =>
                client('messages')
                    .whereRaw('stream_name LIKE ?', [categoryName + '-%'])
                    .orderBy('global_position', 'asc')
            )
            .then(camelCaseKeys);
    };

    const messagesByType = (type) => {
        return mdb
            .then((client) =>
                client('messages')
                    .whereRaw('type LIKE ?', [type])
                    .orderBy('global_position', 'asc')
            )
            .then(camelCaseKeys);
    };

    const views = () => {
        const views = [
            { name: 'admin_categories' },
            { name: 'admin_event_types' },
            { name: 'admin_entities' },
            { name: 'admin_streams' },
            { name: 'admin_subscriber_positions' },
            { name: 'admin_users' },
            { name: 'user_credentials' },
        ];

        return Bluebird.each(views, (view) => {
            return db
                .then((client) => client(view.name).count('* as count'))
                .then((total) => {
                    view.count = total[0].count;
                });
        });
    };

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
        usersIndex,
        user,
        userLoginEvents,
        messages,
        messagesByType,
        correlatedMessages,
        userMessages,
        streamName,
        message,
        streams,
        subscriberPositions,
        categories,
        categoryName,
        views,
        entities,
        entityMessages,
        eventTypes,
    };
};

module.exports = createQueries;
