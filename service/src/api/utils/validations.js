const validate = require('validate.js');

const ValidationError = require('../errors/validation-error');

const ID_PATTERN = '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}';
const STREAM_NAME_PATTERN = '[a-zA-Z:]+-[a-zA-Z0-9:-]+';

const validateMessage = (message) => {
    const constraints = {
        id: {
            presence: true,
            length: {
                minimum: 1,
            },
            format: {
                pattern: ID_PATTERN,
                message: `must be a uuid matching regex ${ID_PATTERN}`,
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
                pattern: STREAM_NAME_PATTERN,
                message: `must be of the form <category-identifier> and match regex ${STREAM_NAME_PATTERN}`,
            },
        },
    };

    const validationErrors = validate(message, constraints);

    if (validationErrors) {
        throw new ValidationError(validationErrors);
    }

    return message;
};

module.exports = validateMessage;
