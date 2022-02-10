const validate = require('../../../utils/validations');

const validateMessage = (c) => {
    validate(c.attributes);
    return c;
};

module.exports = validateMessage;
