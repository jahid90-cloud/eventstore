const express = require('express');

const createHandlers = () => {
    const home = (req, res, next) => {
        if (req.session.userId) res.redirect('/admin/users');
        return res.render('home/templates/home');
    };

    return {
        home,
    };
};

const createHome = () => {
    const handlers = createHandlers();

    const router = express.Router();
    router.route('/').get(handlers.home);

    return {
        router,
    };
};

module.exports = createHome;
