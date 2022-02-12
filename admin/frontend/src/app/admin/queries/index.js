const createUserQueries = require('./user');
const createStreamQueries = require('./stream');
const createCategoryQueries = require('./category');
const createEntityQueries = require('./entity');
const createViewQueries = require('./view');
const createTypeQueries = require('./type');
const createMessageQueries = require('./message');
const createSubscriberQueries = require('./subscriber');

const createQueries = ({ db, mdb }) => {
    const userQueries = createUserQueries({ db, mdb });
    const streamQueries = createStreamQueries({ db, mdb });
    const categoryQueries = createCategoryQueries({ db, mdb });
    const entityQueries = createEntityQueries({ db, mdb });
    const viewQueries = createViewQueries({ db });
    const typeQueries = createTypeQueries({ db, mdb });
    const messageQueries = createMessageQueries({ mdb });
    const subscriberQueries = createSubscriberQueries({ db });

    return {
        ...userQueries,
        ...streamQueries,
        ...categoryQueries,
        ...entityQueries,
        ...viewQueries,
        ...typeQueries,
        ...messageQueries,
        ...subscriberQueries,
    };
};

module.exports = createQueries;
