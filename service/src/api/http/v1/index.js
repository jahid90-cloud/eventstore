const express = require('express');
const bodyParser = require('body-parser');

const createRead = require('./read');
const createWrite = require('./write');
const createReadLastMessage = require('./read-last-message');

const createHttpHandlers = ({ config, eventStore }) => {
    const handleRead = createRead({ config, eventStore });
    const handleReadLastMessage = createReadLastMessage({ config, eventStore });
    const handleWrite = createWrite({ config, eventStore });

    return {
        handleRead,
        handleReadLastMessage,
        handleWrite,
    };
};

const createV1HttpService = ({ config, eventStore }) => {
    const handlers = createHttpHandlers({ config, eventStore });

    const router = express.Router();
    router.post('/write', handlers.handleWrite);
    router.get('/read/:streamName', handlers.handleRead);
    router.get('/last/:streamName', handlers.handleReadLastMessage);

    config.logger.debug('Created v1 http service');

    return {
        router,
    };
};

module.exports = createV1HttpService;
