const EventStoreError = require('./event-store-error');

const WRITE_MESSAGE_SQL = `
    SELECT write_message($1, $2, $3, $4, $5)
`;

const WRITE_MESSAGE_WITH_EXPECTED_VERSION_SQL = `
    SELECT write_message($1, $2, $3, $4, $5, $6)
`;

const createWrite = ({ config, db }) => {
    const write = ({ id, streamName, type, data, metadata, expectedVersion }) => {
        if (expectedVersion) {
            return db.query(WRITE_MESSAGE_WITH_EXPECTED_VERSION_SQL, [
                id,
                streamName,
                type,
                data,
                metadata,
                expectedVersion,
            ]);
        }

        return db.query(WRITE_MESSAGE_SQL, [id, streamName, type, data, metadata]).catch((err) => {
            throw new EventStoreError(err.message);
        });
    };

    return {
        write,
    };
};

module.exports = createWrite;
