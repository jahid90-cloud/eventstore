const { toProtoMessage } = require('../utils/sedes');

const convertToProtoMessage = (c) => {
    c.result = { message: toProtoMessage(c.result.message) };
    return c;
};

module.exports = convertToProtoMessage;
