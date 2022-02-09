const { v4: uuid } = require('uuid');

const proto = require('../../gen/event-store_pb');
const { toProtoMessage } = require('../../api/grpc/v1/sedes');

const createWrite = ({ config }) => {
    const message = {
        id: uuid(),
        type: 'Write',
        streamName: 'write-123',
        data: {
            foo: 1,
        },
        metadata: {
            bar: true,
        },
    };

    const newRequest = () => {
        const msg = toProtoMessage(message);
        const req = new proto.WriteRequest();
        req.setMessage(msg);

        return req;
    };

    const responseHandler = () => {
        return (err, _) => {
            if (err) config.logger.error(err.message);
            else config.logger.info('ok');
        };
    };

    return {
        newRequest,
        responseHandler,
    };
};

module.exports = createWrite;
