const proto = require('../../gen/event-store_pb');
const { fromProtoMessage } = require('../../api/grpc/v1/utils/sedes');

const createLast = ({ config }) => {
    const sampleStreamName = 'write-123';

    const newRequest = () => {
        const req = new proto.LastRequest();
        req.setStreamname(sampleStreamName);

        return req;
    };

    const responseHandler = () => {
        return (err, response) => {
            if (err) config.logger.error(err);
            else config.logger.info(fromProtoMessage(response.getMessage()).id);
        };
    };

    return {
        newRequest,
        responseHandler,
    };
};

module.exports = createLast;
