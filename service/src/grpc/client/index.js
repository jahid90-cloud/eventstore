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
        stub.read(read.newRequest(), read.getMetadata(), read.responseHandler());
        stub.last(last.newRequest(), last.getMetadata(), last.responseHandler());
        stub.write(write.newRequest(), write.getMetadata(), write.responseHandler());
        stub.read(read.newRequest(), read.getMetadata(), read.responseHandler());
        stub.last(last.newRequest(), last.getMetadata(), last.responseHandler());
    };

    config.logger.debug('Created grpc client');

    return {
        testRun,
    };
};

module.exports = createClient;
