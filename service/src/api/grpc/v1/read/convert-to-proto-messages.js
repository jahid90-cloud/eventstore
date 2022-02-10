const { toProtoMessage } = require('../utils/sedes');

const convertToProtoMessages = (c) => {
    c.result = { messages: c.result.messages.map(toProtoMessage) };
    return c;
};

module.exports = convertToProtoMessages;
