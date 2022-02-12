const Bluebird = require('bluebird');
const camelcaseKeys = require('camelcase-keys');
const express = require('express');
const { v4: uuid } = require('uuid');

const ValidationError = require('../errors/validation-error');

const validate = require('./validate');
const loadExistingIdentity = require('./load-existing-identity');
const ensureThereWasNoExistingIdentity = require('./ensure-there-was-no-existing-identity');
const hashPassword = require('./hash-password');
const writeRegisterCommand = require('./write-register-command');
const ServiceError = require('../errors/service-error');

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

const createActions = ({ services, queries }) => {
    const registerUser = (traceId, attributes) => {
        const context = { attributes, traceId, services, queries };

        return Bluebird.resolve(context)
            .then(validate)
            .then(loadExistingIdentity)
            .then(ensureThereWasNoExistingIdentity)
            .then(hashPassword)
            .then(writeRegisterCommand);
    };

    return {
        registerUser,
    };
};

const createHandlers = ({ actions }) => {
    const handleRegistrationForm = (req, res) => {
        const userId = uuid();

        res.render('register-users/templates/register', { userId });
    };

    const handleRegistrationComplete = (req, res) => {
        res.render('register-users/templates/registration-complete');
    };

    const handleRegisterUser = (req, res, next) => {
        const attributes = {
            id: req.body.id,
            email: req.body.email,
            password: req.body.password,
        };

        return actions
            .registerUser(req.context.traceId, attributes)
            .then(() => res.redirect(301, 'register/registration-complete'))
            .catch(ValidationError, (err) =>
                res.status(400).render('register-users/templates/register', {
                    userId: attributes.id,
                    errors: err.errors,
                })
            )
            .catch(ServiceError, (err) =>
                res.status(500).render('register-users/templates/register', {
                    userId: attributes.id,
                    errors: 'Internal Service Error. Please try again later.',
                })
            )
            .catch(next);
    };

    return {
        handleRegistrationForm,
        handleRegistrationComplete,
        handleRegisterUser,
    };
};

const build = ({ db, services }) => {
    const queries = createQueries({ db });
    const actions = createActions({ services, queries });
    const handlers = createHandlers({ actions });

    const router = express.Router();

    router
        .route('/')
        .get(handlers.handleRegistrationForm)
        .post(handlers.handleRegisterUser);

    router
        .route('/registration-complete')
        .get(handlers.handleRegistrationComplete);

    return {
        router,
    };
};

module.exports = build;
