const proto = require('../../gen/event-store_pb');
const { fromProtoMessage } = require('../../api/grpc/v1/utils/sedes');

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
            else
                config.logger.info(
                    response
                        .getMessagesList()
                        .map(fromProtoMessage)
                        .reduce((a, b) => a + 1, 0)
                );
        };
    };

    return {
        newRequest,
        responseHandler,
    };
};

module.exports = createRead;
