const validate = require('validate.js');

const ValidationError = require('../errors/validation-error');

const validateMessage = (message) => {
    const constraints = {
        id: {
            presence: true,
            length: {
                minimum: 1,
            },
            format: {
                pattern: '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
                message: 'must be a uuid consisting of [a-f0-9]',
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
                pattern: '[a-z:]+-[a-z0-9-]+',
                message: 'must be of the form <category-identifier>',
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
