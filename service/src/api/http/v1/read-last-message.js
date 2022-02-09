const { HTTP_STATUS_NOT_FOUND } = require('./http-status');
const sanitize = require('./sanitize');

const createReadLastMessage = ({ config, eventStore }) => {
    const readLastMessage = (req, res) => {
        const streamName = req.params.streamName;
        return eventStore.readLastMessage({ streamName }).then((message) => {
            if (!message) return res.sendStatus(HTTP_STATUS_NOT_FOUND);
            return res.json(sanitize(message));
        });
    };

    return readLastMessage;
};

module.exports = createReadLastMessage;
