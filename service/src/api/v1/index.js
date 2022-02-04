const express = require('express');

const createRead = require('./read');
const createWrite = require('./write');
const createReadLastMessage = require('./read-last-message');
const createProject = require('./project');

const createHandlers = ({ eventStore }) => {
    const read = createRead({ eventStore });
    const write = createWrite({ eventStore });
    const readLastMessage = createReadLastMessage({ eventStore });
    const project = createProject({ eventStore });

    return {
        read,
        readLastMessage,
        write,
        project,
    };
};

const createV1Service = ({ eventStore }) => {
    const handlers = createHandlers({ eventStore });

    const router = express.Router();
    router.post('/write', handlers.write);
    router.get('/read', handlers.read);
    router.get('/read-last-message', handlers.readLastMessage);
    router.post('./project', handlers.project);

    return {
        router,
    };
};

module.exports = createV1Service;
