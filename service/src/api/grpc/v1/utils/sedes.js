const structPb = require('google-protobuf/google/protobuf/struct_pb');

const proto = require('../../../../gen/event-store_pb');

const toProtoMessage = (message) => {
    const protoMessage = new proto.Message();
    protoMessage.setId(message.id);
    protoMessage.setType(message.type);
    protoMessage.setStreamname(message.streamName);
    protoMessage.setData(structPb.Struct.fromJavaScript(message.data));
    protoMessage.setMetadata(structPb.Struct.fromJavaScript(message.metadata));

    return protoMessage;
};

const fromProtoMessage = (message) => {
    return {
        id: message.getId(),
        type: message.getType(),
        streamName: message.getStreamname(),
        data: message.hasData() ? message.getData().toJavaScript() : {},
        metadata: message.hasMetadata() ? message.getMetadata().toJavaScript() : {},
    };
};

module.exports = {
    toProtoMessage,
    fromProtoMessage,
};
