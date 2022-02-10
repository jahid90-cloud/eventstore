const { fromProtoMessage } = require('../utils/sedes');

const deserialize = (c) => {
    c.attributes = { message: fromProtoMessage(c.attributes.message) };
    return c;
};

module.exports = deserialize;
