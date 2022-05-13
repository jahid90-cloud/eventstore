const camelCaseKeys = require('camelcase-keys');

const createStreamQueries = ({ db, mdb }) => {
    const messagesByStreamName = (streamName) => {
        return mdb
            .then((client) =>
                client('messages')
                    .where({ stream_name: streamName })
                    .orderBy('global_position', 'asc')
            )
            .then(camelCaseKeys);
    };

    const allStreams = () => {
        return db
            .then((client) =>
                client('admin_streams').orderBy('stream_name', 'ASC')
            )
            .then(camelCaseKeys);
    };

    return {
        messagesByStreamName,
        allStreams,
    };
};

module.exports = createStreamQueries;
