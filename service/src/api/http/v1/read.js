const { HTTP_STATUS_NOT_FOUND } = require('./http-status');
const sanitize = require('./sanitize');

const createRead = ({ config, eventStore }) => {
    const read = (req, res) => {
        const streamName = req.params.streamName;
        return eventStore.read({ streamName }).then((messages) => {
            if (!messages || (Array.isArray(messages) && messages.length === 0))
                return res.sendStatus(HTTP_STATUS_NOT_FOUND);
            return res.json(messages.map(sanitize));
        });
    };

    return read;
};

module.exports = createRead;
