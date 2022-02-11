const grpc = require('@grpc/grpc-js');

const proto = require('../../gen/event-store_pb');
const { fromProtoMessage } = require('../../api/grpc/v1/utils/sedes');

const createLast = ({ config }) => {
    const sampleStreamName = 'client-test-grpc-client';

    const newRequest = () => {
        const req = new proto.LastRequest();
        req.setStreamname(sampleStreamName);

        return req;
    };

    const getMetadata = () => {
        const metadata = new grpc.Metadata();
        metadata.add('authorisation', 'Basic admin:password');
        metadata.add('x-evs-client-id', 'test-grpc-client');
        return metadata;
    };

    const responseHandler = () => {
        return (err, response) => {
            if (err) config.logger.error(err.message);
            else config.logger.info(fromProtoMessage(response.getMessage()).id);
        };
    };

    return {
        newRequest,
        getMetadata,
        responseHandler,
    };
};

module.exports = createLast;
