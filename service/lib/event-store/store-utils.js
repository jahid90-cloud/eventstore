const EventStoreError = require('./event-store-error');

const createStoreUtils = ({ config }) => {
    const isCategory = (streamName) => {
        return !streamName.includes('-');
    };

    const isStream = (streamName) => {
        return streamName.includes('-');
    };

    const extractCategoryFromStream = (streamName) => {
        if (!isStream) {
            throw new EventStoreError(`Must be a stream: ${streamName}`);
        }

        return streamName.split('-')[0];
    };

    const extractEntityIdFromStream = (streamName) => {
        if (!isStream(streamName)) {
            throw new EventStoreError(`Must be a stream: ${streamName}`);
        }

        return streamName.split(/-(.+)/)[1];
    };

    return {
        isCategory,
        isStream,
        extractCategoryFromStream,
        extractEntityIdFromStream,
    };
};

module.exports = createStoreUtils;
