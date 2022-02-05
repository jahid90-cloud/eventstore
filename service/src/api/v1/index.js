const express = require('express');
const bodyParser = require('body-parser');

const createRead = require('./read');
const createWrite = require('./write');
const createReadLastMessage = require('./read-last-message');
const createProject = require('./project');

const createHttpHandlers = ({ config, eventStore }) => {
    const handleRead = createRead({ config, eventStore });
    const handleReadLastMessage = createReadLastMessage({ config, eventStore });
    const handleWrite = createWrite({ config, eventStore });
    const handleProject = createProject({ config, eventStore });

    return {
        handleRead,
        handleReadLastMessage,
        handleWrite,
        handleProject,
    };
};

const createV1Service = ({ config, eventStore }) => {
    const handlers = createHttpHandlers({ config, eventStore });

    const router = express.Router();
    router.post('/write', handlers.handleWrite);
    router.get('/read/:streamName', handlers.handleRead);
    router.get('/last/:streamName', handlers.handleReadLastMessage);
    router.post('/project/:streamName', handlers.handleProject);

    return {
        router,
    };
};

module.exports = createV1Service;
