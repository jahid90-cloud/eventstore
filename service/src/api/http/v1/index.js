const express = require('express');

const createRead = require('./read');
const createReadLastMessage = require('./read-last-message');
const createWrite = require('./write');

const createHttpHandlers = ({ config, eventStore }) => {
    const readApi = createRead({ config, eventStore });
    const readLastApi = createReadLastMessage({ config, eventStore });
    const writeApi = createWrite({ config, eventStore });

    return {
        readApi,
        readLastApi,
        writeApi,
    };
};

const createV1HttpService = ({ config, eventStore }) => {
    const handlers = createHttpHandlers({ config, eventStore });

    const router = express.Router();
    router.get('/read/:streamName', handlers.readApi.handlers.read);
    router.get('/last/:streamName', handlers.readLastApi.handlers.readLastMessage);
    router.post('/write', handlers.writeApi.handlers.write);

    config.logger.debug('Created v1 http service');

    return {
        router,
    };
};

module.exports = createV1HttpService;
