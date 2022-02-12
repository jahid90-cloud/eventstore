const Bluebird = require('bluebird');
const camelcaseKeys = require('camelcase-keys');
const express = require('express');

const NotFoundError = require('../errors/not-found-error');

const loadUser = require('./load-user');
const ensureUserFound = require('./ensure-user-found');
const writeAdminPrivilegeAddedEvent = require('./write-admin-privilege-added-event');
const writeAdminPrivilegeRemovedEvent = require('./write-admin-privilege-removed-event');

const createQueries = ({ db }) => {
    const byEmail = (email) => {
        return db
            .then((client) =>
                client('user_credentials').where({ email }).limit(1)
            )
            .then(camelcaseKeys)
            .then((rows) => rows[0]);
    };

    return {
        byEmail,
    };
};

const createActions = ({ queries, services }) => {
    const addAdminPrivilege = (userId, traceId, email) => {
        const context = {
            userId,
            traceId,
            email,
            queries,
            services,
        };

        return Bluebird.resolve(context)
            .then(loadUser)
            .then(ensureUserFound)
            .then(writeAdminPrivilegeAddedEvent)
            .catch(NotFoundError, () => handleUserNotFound(context));
    };

    const removeAdminPrivilege = (userId, traceId, email) => {
        const context = {
            userId,
            traceId,
            email,
            queries,
            services,
        };

        return Bluebird.resolve(context)
            .then(loadUser)
            .then(ensureUserFound)
            .then(writeAdminPrivilegeRemovedEvent)
            .catch(NotFoundError, () => handleUserNotFound(context));
    };

    return {
        addAdminPrivilege,
        removeAdminPrivilege,
    };
};

const createHandlers = ({ actions }) => {
    const handleAdminPrivilegeAdd = (req, res) => {
        const { email } = req.body;
        const { userId, traceId } = req.context;

        return actions
            .addAdminPrivilege(userId, traceId, email)
            .then(() => res.redirect('/admin/users'));
    };

    const handleAdminPrivilegeRemoval = (req, res) => {
        const { email } = req.body;
        const { userId, traceId } = req.context;

        return actions
            .removeAdminPrivilege(userId, traceId, email)
            .then(() => res.redirect('/admin/users'));
    };

    return {
        handleAdminPrivilegeAdd,
        handleAdminPrivilegeRemoval,
    };
};

const build = ({ db, services }) => {
    const queries = createQueries({ db });
    const actions = createActions({ queries, services });
    const handlers = createHandlers({ actions });

    const router = express.Router();

    router.route('/add-admin-privilege').post(handlers.handleAdminPrivilegeAdd);
    router
        .route('/remove-admin-privilege')
        .post(handlers.handleAdminPrivilegeRemoval);

    return {
        router,
    };
};

module.exports = build;
