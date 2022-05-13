const camelCaseKeys = require('camelcase-keys');

const createSubscriberQueries = ({ db }) => {
    const subscriberPositions = () => {
        return db.then((client) =>
            client('admin_subscriber_positions').then(camelCaseKeys)
        );
    };

    return {
        subscriberPositions,
    };
};

module.exports = createSubscriberQueries;
