const createRead = require('./read');
const createWrite = require('./write');
const createSubscribe = require('./subscribe');

const createEventStore = ({ config }) => {
    const read = createRead({ config });
    const write = createWrite({ config });
    const subscribe = createSubscribe({ config });

    return {
        read: read.read,
        readLastMessage: read.readLastMessage,
        subscribe: subscribe.subscribe,
        write: write.write,
    };
};

module.exports = createEventStore;
