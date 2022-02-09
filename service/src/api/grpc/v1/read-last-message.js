const Bluebird = require('bluebird');

const ApiError = require('../../errors/api-error');

const proto = require('../../../gen/event-store_pb');
const { toProtoMessage } = require('./sedes');
const sanitize = require('./sanitize');

const extractAttributes = (c) => ({
    ...c,
    attributes: {
        streamName: c.req.getStreamname(),
    },
});

const readLastMessageFromEventStore = (c) => {
    return c.eventStore.readLastMessage(c.attributes);
};

const toLastResponse = (message) => {
    const res = new proto.LastResponse();
    res.setMessage(message);

    return res;
};

const handleSuccess = (res, callback) => {
    return callback(null, res);
};

const handleFailure = (err, callback) => {
    return callback(new ApiError(err.message, 500), null);
};

const createReadLastMessage = ({ config, eventStore }) => {
    const readLastMessage = (call, callback) => {
        const context = { req: call.request, eventStore };
        return Bluebird.resolve(context)
            .then(extractAttributes)
            .then(readLastMessageFromEventStore)
            .then(sanitize)
            .then(toProtoMessage)
            .then(toLastResponse)
            .then((res) => handleSuccess(res, callback))
            .catch((err) => handleFailure(err, callback));
    };

    return readLastMessage;
};

module.exports = createReadLastMessage;
