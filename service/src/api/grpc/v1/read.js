const Bluebird = require('bluebird');
const structPb = require('google-protobuf/google/protobuf/struct_pb');

const ApiError = require('../../errors/api-error');

const proto = require('../../../gen/event-store_pb');
const { toProtoMessage } = require('./sedes');

const toReadResponse = (messages) => {
    const res = new proto.ReadResponse();
    res.setMessagesList(messages);

    return res;
};

const createRead = ({ config, eventStore }) => {
    const read = (call, callback) => {
        const context = {
            streamName: call.request.getStreamname(),
        };

        return Bluebird.resolve(context)
            .then(eventStore.read)
            .then((messages) => messages.map(toProtoMessage))
            .then(toReadResponse)
            .then((res) => callback(null, res))
            .catch((err) => {
                config.logger.error(err);
                return callback(new ApiError(err.message, 500), null);
            });
    };

    return read;
};

module.exports = createRead;
