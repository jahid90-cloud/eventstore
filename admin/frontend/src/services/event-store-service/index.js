const axios = require('axios');

const createService = ({ env }) => {
    const service = axios.create({
        baseURL: env.eventStoreServiceUrl,
        timeout: 1000,
        headers: {
            Authorization: `Basic ${env.eventStoreServiceCredentials}`,
            'x-evs-client-id': env.eventStoreClientId,
        },
    });

    const readMessage = (streamName) => {
        return service.get(`/v1/read/${streamName}`);
    };

    const readLastMessage = (streamName) => {
        return service.get(`/v1/last/${streamName}`);
    };

    const writeMessage = (message) => {
        return service.post('/v1/write', message);
    };

    return {
        readMessage,
        readLastMessage,
        writeMessage,
    };
};

module.exports = createService;
