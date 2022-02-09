const Bluebird = require('bluebird');

const ApiError = require('../../errors/api-error');

const proto = require('../../../gen/event-store_pb');
const { toProtoMessage } = require('./sedes');

const toLastResponse = (message) => {
    const res = new proto.LastResponse();
    res.setMessage(message);

    return res;
};

const createReadLastMessage = ({ config, eventStore }) => {
    const readLastMessage = (call, callback) => {
        const context = {
            streamName: call.request.getStreamname(),
        };

        return Bluebird.resolve(context)
            .then(eventStore.readLastMessage)
            .then(toProtoMessage)
            .then(toLastResponse)
            .then((res) => callback(null, res))
            .catch((err) => {
                config.logger.error(err);
                return callback(new ApiError(err.message, 500), null);
            });
    };

    return readLastMessage;
};

module.exports = createReadLastMessage;
