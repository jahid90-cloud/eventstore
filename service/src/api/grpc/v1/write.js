const Bluebird = require('bluebird');

const ApiError = require('../../errors/api-error');
const ValidationError = require('../../errors/validation-error');

const proto = require('../../../gen/event-store_pb');
const validateMessage = require('../../validations/message');
const { fromProtoMessage } = require('./sedes');

const extractAttributes = (c) => ({
    ...c,
    attributes: c.req.getMessage(),
    metadata: { traceId: (c.req.context && c.req.context.traceId) || 'None' },
});

const toEvsMessage = (c) => ({
    ...c,
    attributes: fromProtoMessage(c.attributes),
});

const validateEvsMessage = (c) => {
    validateMessage(c);

    return c;
};

const hydrateMetadata = (c) => ({
    ...c,
    attributes: {
        ...c.attributes,
        metadata: {
            ...c.attributes.metadata,
            evsTraceId: c.metadata.traceId,
        },
    },
});

const writeToEventStore = (c) => {
    c.eventStore.write(c.attributes);
    return c;
};

const toWriteResponse = (_) => {
    const res = new proto.WriteResponse();
    return res;
};

const handleSuccess = (res, callback) => {
    return callback(null, res);
};

const handleValidationFailure = (err, callback) => {
    return callback(new ApiError(err.message, 400));
};

const handleFailure = (err, callback) => {
    if (err.message && err.message.includes('duplicate key')) {
        return callback(new ApiError('Message with duplicate id', 400), null);
    }
    return callback(new ApiError(err.message, 500), null);
};

const createWrite = ({ config, eventStore }) => {
    const write = (call, callback) => {
        const context = { req: call.request, eventStore };
        return Bluebird.resolve(context)
            .then(extractAttributes)
            .then(toEvsMessage)
            .then(validateEvsMessage)
            .then(hydrateMetadata)
            .then(writeToEventStore)
            .then(toWriteResponse)
            .then((res) => handleSuccess(res, callback))
            .catch(ValidationError, (err) => handleValidationFailure(err, callback))
            .catch((err) => handleFailure(err, callback));
    };

    return write;
};

module.exports = createWrite;
