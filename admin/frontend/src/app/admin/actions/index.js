const createMessageActions = require('./message');
const createViewActions = require('./view');
const createSubscriberActions = require('./subscriber');

const createActions = ({ db, mdb, services }) => {
    const messageActions = createMessageActions({ mdb, services });
    const viewActions = createViewActions({ db });
    const subscriberActions = createSubscriberActions({ services });

    return {
        ...messageActions,
        ...viewActions,
        ...subscriberActions,
    };
};

module.exports = createActions;
