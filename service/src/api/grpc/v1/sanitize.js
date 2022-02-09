const sanitize = (message) => {
    message.metadata && message.metadata.evsTraceId && delete message.metadata.evsTraceId;
    return message;
};

module.exports = sanitize;
