const structPb = require('google-protobuf/google/protobuf/struct_pb');

const proto = require('../../../gen/event-store_pb');

const toProtoMessage = (message) => {
    const msg = new proto.Message();
    msg.setId(message.id);
    msg.setType(message.type);
    msg.setStreamname(message.streamName);
    msg.setData(structPb.Struct.fromJavaScript(message.data));
    msg.setMetadata(structPb.Struct.fromJavaScript(message.metadata));

    return msg;
};

const fromProtoMessage = (msg) => {
    return {
        id: msg.getId(),
        type: msg.getType(),
        streamName: msg.getStreamname(),
        data: msg.hasData() ? msg.getData().toJavaScript() : {},
        metadata: msg.hasMetadata() ? msg.getMetadata().toJavaScript() : {},
    };
};

module.exports = {
    toProtoMessage,
    fromProtoMessage,
};
