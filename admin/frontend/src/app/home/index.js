const express = require('express');

const createHandlers = () => {
    const home = (req, res, next) => {
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
