const mustBeLoggedIn = require('./must-be-logged-in');
const mustBeAdminUser = require('./must-be-admin-user');

const mountRoutes = (app, config) => {
    app.use('/', config.homeApp.router);
    app.use('/admin', mustBeLoggedIn, mustBeAdminUser, config.adminApp.router);
    app.use('/auth', config.authenticationApp.router);
    app.use('/register', config.registerUsersApp.router);
    app.use(
        '/users',
        mustBeLoggedIn,
        mustBeAdminUser,
        config.manageUsersApp.router
    );
};

module.exports = mountRoutes;
