const { renderPaginatedMessages } = require('./utils');

const createStreamHandlers = ({ actions, queries }) => {
    const handleStreamsIndex = (req, res) => {
        return queries
            .allStreams()
            .then((streams) =>
                res.render('admin/templates/streams-index', { streams })
            );
    };
    const handleShowStream = (req, res) => {
        const streamName = req.params.streamName;

        return queries
            .messagesByStreamName(streamName)
            .then((messages) =>
                renderPaginatedMessages(
                    req,
                    res,
                    messages,
                    'admin/templates/messages-index',
                    `Stream: ${streamName}`
                )
            );
    };

    return {
        handleShowStream,
        handleStreamsIndex,
    };
};

module.exports = createStreamHandlers;
