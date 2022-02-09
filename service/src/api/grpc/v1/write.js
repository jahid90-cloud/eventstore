const Bluebird = require('bluebird');

const ApiError = require('../../errors/api-error');
const ValidationError = require('../../errors/validation-error');

const proto = require('../../../gen/event-store_pb');
const validateMessage = require('../../validations/message');
const { fromProtoMessage } = require('./sedes');

const toWriteResponse = (_) => {
    const res = new proto.WriteResponse();
    return res;
};

const createWrite = ({ config, eventStore }) => {
    const write = (call, callback) => {
        const message = fromProtoMessage(call.request.getMessage());
        const context = {
            id: message.id,
            type: message.type,
            streamName: message.streamName,
            data: {
                ...message.data,
            },
            metadata: {
                ...message.metadata,
                evsTraceId: (call.request.context && call.request.context.traceId) || 'None',
            },
        };

        console.log(context);

        return Bluebird.resolve(context)
            .then(validateMessage)
            .then(eventStore.write)
            .then(toWriteResponse)
            .then((res) => callback(null, res))
            .catch(ValidationError, (err) => callback(new ApiError(err.message, 400)))
            .catch((err) => {
                if (err.message && err.message.includes('duplicate key')) {
                    return callback(new ApiError('Message with duplicate id', 400), null);
                }
                return callback(new ApiError(err.message, 500), null);
            });
    };

    return write;
};

module.exports = createWrite;
