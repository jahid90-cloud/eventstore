const Bluebird = require('bluebird');
const validate = require('validate.js');

const ValidationError = require('../errors/validation-error');

const HTTP_STATUS_ACCEPTED = '202';
const HTTP_STATUS_BAD_REQUEST = '400';

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

const validateInput = (context) => {
    const constraints = {
        id: {
            presence: true,
            length: {
                minimum: 1,
            },
            format: {
                pattern: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
                message: 'must be a uuid',
            },
        },
        type: {
            presence: true,
            length: {
                minimum: 4,
            },
        },
        streamName: {
            presence: true,
            length: {
                minimum: 1,
            },
            format: {
                pattern: '[a-z]+-[a-z0-9-]+',
                message: 'must be of the form <category-identifier>',
            },
        },
    };

    const validationErrors = validate(context.attributes, constraints);

    if (validationErrors) {
        throw new ValidationError(validationErrors);
    }

    return context;
};

const createWrite = ({ config, eventStore }) => {
    const write = (req, res, next) => {
        const context = generateContextFromRequest(req);

        return Bluebird.resolve(context)
            .then(validateInput)
            .then((context) => {
                config.logger.debug(`Writing ${JSON.stringify(context.attributes)} to event store`);
                return context;
            })
            .then((context) => eventStore.write(context.attributes))
            .then(() => res.send(HTTP_STATUS_ACCEPTED))
            .catch(ValidationError, (err) => {
                config.logger.error(err);
                return res.status(HTTP_STATUS_BAD_REQUEST).send(err);
            })
            .catch((err) => {
                if (err.message.includes('duplicate key')) {
                    return res.status(HTTP_STATUS_BAD_REQUEST).send('Message with duplicate id');
                }

                return next(err);
            });
    };

    return write;
};

module.exports = createWrite;
