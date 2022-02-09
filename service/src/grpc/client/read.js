const proto = require('../../gen/event-store_pb');
const { fromProtoMessage } = require('../../api/grpc/v1/sedes');

const createRead = ({ config }) => {
    const sampleStreamName = 'write-123';

    const newRequest = () => {
        const req = new proto.ReadRequest();
        req.setStreamname(sampleStreamName);

        return req;
    };

    const responseHandler = () => {
        return (err, response) => {
            if (err) config.logger.error(err.message);
            else config.logger.info(response.getMessagesList().map(fromProtoMessage));
        };
    };

    return {
        newRequest,
        responseHandler,
    };
};

module.exports = createRead;
