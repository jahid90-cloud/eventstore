const express = require('express');

const createHttpHandlers = ({ config }) => {
    const handlePing = (req, res) => {
        return res.send('OK');
    };

    const handleDeepPing = (req, res) => {
        return res.send('OK');
    };

    return {
        handlePing,
        handleDeepPing,
    };
};

const createPingService = ({ config }) => {
    const handlers = createHttpHandlers({ config });

    const router = express.Router();
    router.get('/ping', handlers.handlePing);
    router.get('/deep-ping', handlers.handleDeepPing);

    return {
        router,
    };
};

module.exports = createPingService;
