const createRead = require('./read');
const createWrite = require('./write');
const createSubscribe = require('./subscribe');

const createEventStore = ({ config, db }) => {
    const read = createRead({ config, db });
    const write = createWrite({ config, db });
    const subscribe = createSubscribe({ config, db });

    return {
        read: read.read,
        readLastMessage: read.readLastMessage,
        subscribe: subscribe.subscribe,
        write: write.write,
    };
};

module.exports = createEventStore;
