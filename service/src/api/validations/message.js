const validate = require('validate.js');

const ValidationError = require('../errors/validation-error');

const validateMessage = (context) => {
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

    const validationErrors = validate(context, constraints);

    if (validationErrors) {
        throw new ValidationError(validationErrors);
    }

    return context;
};

module.exports = validateMessage;
