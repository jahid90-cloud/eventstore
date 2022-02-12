const createUserHandlers = require('./user');
const createStreamHandlers = require('./stream');
const createCategoryHandlers = require('./category');
const createEntityHandlers = require('./entity');
const createSubscriberHandlers = require('./subscriber');
const createViewHandlers = require('./view');
const createTypeHandlers = require('./type');
const createMessageHandlers = require('./message');

const createHandlers = ({ actions, queries }) => {
    const userHandlers = createUserHandlers({ actions, queries });
    const streamHandlers = createStreamHandlers({ actions, queries });
    const categoryHandlers = createCategoryHandlers({ actions, queries });
    const entityHandlers = createEntityHandlers({ actions, queries });
    const subscriberHandlers = createSubscriberHandlers({ actions, queries });
    const viewHandlers = createViewHandlers({ actions, queries });
    const typeHandlers = createTypeHandlers({ actions, queries });
    const messageHandlers = createMessageHandlers({ actions, queries });

    return {
        ...userHandlers,
        ...streamHandlers,
        ...categoryHandlers,
        ...entityHandlers,
        ...subscriberHandlers,
        ...viewHandlers,
        ...typeHandlers,
        ...messageHandlers,
    };
};

module.exports = createHandlers;
