const EventStoreError = require('./event-store-error');

const createSedes = require('./sedes');
const createStoreUtils = require('./store-utils');

const GET_ALL_STREAM_MESSAGES_SQL = `
    SELECT * FROM get_stream_messages($1, $2, $3)
`;
const GET_ALL_STREAM_MESSAGES_WITH_CONDITION_SQL = `
    SELECT * FROM get_stream_messages($1, $2, $3, $4)
`;

const GET_ALL_CATEGORY_MESSAGES_SQL = `
    SELECT * FROM get_category_messages($1, $2, $3)
`;
const GET_ALL_CATEGORY_MESSAGES_WITH_CORRELATION_SQL = `
    SELECT * FROM get_category_messages($1, $2, $3, $4)
`;
const GET_ALL_CATEGORY_MESSAGES_WITH_CONDITION_SQL = `
    SELECT * FROM get_category_messages($1, $2, $3, $4, $5, $6, $7)
`;

const GET_LAST_STREAM_MESSAGE_SQL = `
    SELECT * FROM get_last_stream_message($1)
`;

const GET_ALL_MESSAGES_SQL = `
    SELECT
        *
    FROM
        messages
    WHERE
        global_position >= $1
    LIMIT
        $2
    ORDER
        BY global_position ASC
`;
const GET_ALL_MESSAGES_WITH_CONDITION_SQL = `
    SELECT
        *
    FROM
        messages
    WHERE
        global_position >= $1
        AND $3
    LIMIT
        $2
    ORDER
        BY global_position ASC
`;

const createRead = ({ config, db }) => {
    const { deserialize } = createSedes({ config });
    const { isCategory } = createStoreUtils({ config });

    const read = ({
        streamName,
        fromPosition = 0,
        batchSize = 1000,
        correlation = null,
        consumerGroupMember = 0,
        consumerGroupSize = 1,
        condition = null,
    }) => {
        if (streamName === '$all') {
            if (condition) {
                return db
                    .query(GET_ALL_MESSAGES_WITH_CONDITION_SQL, [fromPosition, batchSize, condition])
                    .then((res) => res.rows)
                    .then((messages) => messages.map(deserialize))
                    .catch((err) => {
                        throw new EventStoreError(err);
                    });
            } else {
                return db
                    .query(GET_ALL_MESSAGES_SQL, [fromPosition, batchSize])
                    .then((res) => res.rows)
                    .then((messages) => messages.map(deserialize))
                    .catch((err) => {
                        throw new EventStoreError(err);
                    });
            }
        } else if (isCategory(streamName)) {
            if (condition) {
                return db
                    .query(GET_ALL_CATEGORY_MESSAGES_WITH_CONDITION_SQL, [
                        streamName,
                        fromPosition,
                        batchSize,
                        correlation,
                        consumerGroupMember,
                        consumerGroupSize,
                        condition,
                    ])
                    .then((res) => res.rows)
                    .then((messages) => messages.map(deserialize))
                    .catch((err) => {
                        throw new EventStoreError(err);
                    });
            } else if (correlation) {
                return db
                    .query(GET_ALL_CATEGORY_MESSAGES_WITH_CORRELATION_SQL, [
                        streamName,
                        fromPosition,
                        batchSize,
                        correlation,
                    ])
                    .then((res) => res.rows)
                    .then((messages) => messages.map(deserialize))
                    .catch((err) => {
                        throw new EventStoreError(err);
                    });
            } else {
                return db
                    .query(GET_ALL_CATEGORY_MESSAGES_SQL, [streamName, fromPosition, batchSize])
                    .then((res) => res.rows)
                    .then((messages) => messages.map(deserialize))
                    .catch((err) => {
                        throw new EventStoreError(err);
                    });
            }
        } else {
            if (condition) {
                return db
                    .query(GET_ALL_STREAM_MESSAGES_WITH_CONDITION_SQL, [streamName, fromPosition, batchSize, condition])
                    .then((res) => res.rows)
                    .then((messages) => messages.map(deserialize))
                    .catch((err) => {
                        throw new EventStoreError(err);
                    });
            } else {
                return db
                    .query(GET_ALL_STREAM_MESSAGES_SQL, [streamName, fromPosition, batchSize])
                    .then((res) => res.rows)
                    .then((messages) => messages.map(deserialize))
                    .catch((err) => {
                        throw new EventStoreError(err);
                    });
            }
        }
    };

    const readLastMessage = ({ streamName }) => {
        return db
            .query(GET_LAST_STREAM_MESSAGE_SQL, [streamName])
            .then((res) => res.rows)
            .then((rows) => rows[0])
            .then(deserialize)
            .catch((err) => {
                throw new EventStoreError(err);
            });
    };

    return {
        read,
        readLastMessage,
    };
};

module.exports = createRead;
