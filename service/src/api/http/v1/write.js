const Bluebird = require('bluebird');

const ApiError = require('../../errors/api-error');
const ValidationError = require('../../errors/validation-error');

const { HTTP_STATUS_ACCEPTED, HTTP_STATUS_BAD_REQUEST } = require('./http-status');

const validateMessage = require('../../utils/validations');

const generateContextFromRequest = (req) => {
    const { id, type, streamName, data = {}, metadata = {} } = req.body;
    return {
        attributes: {
            id,
            type,
            streamName,
            data,
            metadata: {
                ...metadata,
                evsTraceId: (req.context && req.context.traceId) || 'None',
            },
        },
    };
};

const createWrite = ({ config, eventStore }) => {
    const write = (req, res, next) => {
        const context = generateContextFromRequest(req);

        return Bluebird.resolve(context)
            .then(validateMessage)
            .then((context) => eventStore.write(context.attributes))
            .then(() => res.sendStatus(HTTP_STATUS_ACCEPTED))
            .catch(ValidationError, (err) => res.status(HTTP_STATUS_BAD_REQUEST).send(new ApiError(err.message, 400)))
            .catch((err) => {
                if (err.message && err.message.includes('duplicate key')) {
                    return res.status(HTTP_STATUS_BAD_REQUEST).send(new ApiError('Message with duplicate id', 400));
                }

                return next(err);
            });
    };

    return write;
};

module.exports = createWrite;
