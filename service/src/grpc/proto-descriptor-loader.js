const path = require('path');
const grpc = require('@grpc/grpc-js');

const eventStorePackageDefinition = require('../gen/event-store_grpc_pb');

const createProtoDescriptorLoader = ({ config }) => {
    const load = () => {
        const protoDescriptor = grpc.loadPackageDefinition(eventStorePackageDefinition);

        config.logger.debug('grpc proto loaded');

        return protoDescriptor;
    };

    config.logger.debug('Created grpc proto loader');

    return {
        load,
    };
};

module.exports = createProtoDescriptorLoader;
