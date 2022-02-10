const proto = require('../gen/event-store_pb');

const createAttachProtoMiddleware = ({ config }) => {
    const apply = (handler) => {
        return (call, callback, context) => {
            context = context || {};
            context.proto = proto;
            handler(call, callback, context);
        };
    };

    config.logger.debug('Created attach grpc proto middleware');

    return {
        apply,
    };
};

module.exports = createAttachProtoMiddleware;
