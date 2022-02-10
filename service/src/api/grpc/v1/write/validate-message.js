const validate = require('../../../utils/validations');

const validateMessage = (c) => {
    validate(c.attributes.message);
    return c;
};

module.exports = validateMessage;
