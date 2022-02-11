const grpc = require('@grpc/grpc-js');
const { v4: uuid } = require('uuid');

const proto = require('../../gen/event-store_pb');
const { toProtoMessage } = require('../../api/grpc/v1/utils/sedes');

const createWrite = ({ config }) => {
    const message = {
        id: uuid(),
        type: 'GrpcClientTest',
        streamName: 'client-test-grpc-client',
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

    const getMetadata = () => {
        const metadata = new grpc.Metadata();
        metadata.add('authorisation', 'Basic admin:password');
        metadata.add('x-evs-client-id', 'test-grpc-client');
        return metadata;
    };

    const responseHandler = () => {
        return (err, _) => {
            if (err) config.logger.error(err.message);
            else config.logger.info('ok');
        };
    };

    return {
        newRequest,
        getMetadata,
        responseHandler,
    };
};

module.exports = createWrite;
