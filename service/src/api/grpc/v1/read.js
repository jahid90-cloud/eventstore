const Bluebird = require('bluebird');
const structPb = require('google-protobuf/google/protobuf/struct_pb');

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

const readFromEventStore = (c) => {
    return c.eventStore.read(c.attributes);
};

const toReadResponse = (messages) => {
    const res = new proto.ReadResponse();
    res.setMessagesList(messages);

    return res;
};

const handleSuccess = (res, callback) => {
    return callback(null, res);
};

const handleFailure = (err, callback) => {
    return callback(new ApiError(err.message, 500), null);
};

const createRead = ({ config, eventStore }) => {
    const read = (call, callback) => {
        const context = { req: call.request, eventStore };
        return Bluebird.resolve(context)
            .then(extractAttributes)
            .then(readFromEventStore)
            .then((messages) => messages.map(sanitize))
            .then((messages) => messages.map(toProtoMessage))
            .then(toReadResponse)
            .then((res) => handleSuccess(res, callback))
            .catch((err) => handleFailure(err, callback));
    };

    return read;
};

module.exports = createRead;
