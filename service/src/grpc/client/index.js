const grpc = require('@grpc/grpc-js');

const createProtoDescriptorLoader = require('../proto-descriptor-loader');

const createRead = require('./read');
const createLast = require('./last');
const createWrite = require('./write');

const createClient = ({ env, config }) => {
    const protoDescriptorLoader = createProtoDescriptorLoader({ config });
    const protoDescriptor = protoDescriptorLoader.load();
    const stub = new protoDescriptor.v1.EventStore(env.grpcAddress, grpc.credentials.createInsecure());

    const read = createRead({ config });
    const last = createLast({ config });
    const write = createWrite({ config });

    const testRun = () => {
        // Would be NotFound the first time
        stub.read(read.newRequest(), read.getMetadata(), read.responseHandler());
        stub.last(last.newRequest(), last.getMetadata(), last.responseHandler());

        // Write a message
        stub.write(write.newRequest(), write.getMetadata(), write.responseHandler());

        // Give time for write to complete, so response is not NotFound, but Success
        setTimeout(() => {
            stub.read(read.newRequest(), read.getMetadata(), read.responseHandler());
            stub.last(last.newRequest(), last.getMetadata(), last.responseHandler());
        }, 2 * 1000);
    };

    config.logger.debug('Created grpc client');

    return {
        testRun,
    };
};

module.exports = createClient;
