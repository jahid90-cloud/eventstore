const bodyParser = require('body-parser');
const express = require('express');

const createQueries = require('./queries');
const createActions = require('./actions');
const createHandlers = require('./handlers');

const createAdminApplication = ({ db, mdb, services }) => {
    const queries = createQueries({ db, mdb });
    const actions = createActions({ db, mdb, services });
    const handlers = createHandlers({ actions, queries });

    const router = express.Router();

    router.route('/').get((req, res) => res.redirect('/admin/users'));

    router.route('/users').get(handlers.handleUsersIndex);
    router.route('/users/:id').get(handlers.handleShowUser);

    router.route('/messages/:id').get(handlers.handleShowMessage);
    router.route('/messages').get(handlers.handleMessagesIndex);
    router.route('/messages/:id').delete(handlers.handleDeleteMessage);
    router
        .route('/messages')
        .delete(
            bodyParser.urlencoded({ extended: false }),
            handlers.handleDeleteAllMessages
        );
    router.route('/messages/:id').post(handlers.handleResendMessage);

    router
        .route('/correlated-messages/:traceId')
        .get(handlers.handleCorrelatedMessagesIndex);
    router
        .route('/user-messages/:userId')
        .get(handlers.handleUserMessagesIndex);

    router.route('/streams').get(handlers.handleStreamsIndex);
    router.route('/streams/:streamName').get(handlers.handleShowStream);

    router
        .route('/subscriber-positions')
        .get(handlers.handleSubscriberPositions);
    router
        .route('/subscriber-positions/reset/:id')
        .post(handlers.handleSubscriberPositionReset);

    router.route('/categories').get(handlers.handleCategoriesIndex);
    router.route('/categories/:categoryName').get(handlers.handleShowCategory);

    router.route('/type-messages/:type').get(handlers.handleMessagesOfType);

    router.route('/views').get(handlers.handleViewsIndex);
    router.route('/views/:name').post(handlers.handleClearView);

    router.route('/entities').get(handlers.handleEntitiesIndex);
    router.route('/entities/:id').get(handlers.handleEntityMessagesIndex);

    router.route('/events').get(handlers.handleShowEventTypes);

    return {
        router,
    };
};

module.exports = createAdminApplication;
