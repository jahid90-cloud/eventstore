const axios = require('axios');
const { v4: uuid } = require('uuid');

const CLIENT_ID = 'test-http-client';

const createClient = ({ env, config }) => {
    const service = axios.create({
        baseURL: `http://localhost:${env.port}`,
        timeout: 1000,
        headers: {
            'x-evs-client-id': CLIENT_ID,
        },
    });

    const streamName = 'client-test-http-client';
    const message = {
        id: uuid(),
        type: 'HttpClientTest',
        streamName,
        data: {
            foo: 1,
        },
        metadata: {
            bar: true,
        },
    };

    const handleReadSuccess = (res) => config.logger.info(res.data.reduce((a, b) => a + 1, 0));
    const handleLastSuccess = (res) => config.logger.info(res.data.id);
    const handleWriteSuccess = (res) => config.logger.info('ok');
    const handleFailure = (err) => config.logger.error(err.response.statusText);

    const testRun = () => {
        // Should be NotFound the first time
        service.get(`/v1/read/${streamName}`).then(handleReadSuccess).catch(handleFailure);
        service.get(`/v1/last/${streamName}`).then(handleLastSuccess).catch(handleFailure);

        // Write a message
        service
            .post(`/v1/write`, { ...message })
            .then(handleWriteSuccess)
            .catch(handleFailure);

        // Give time for write to complete, so response is not NotFound, but Success
        setTimeout(() => {
            service.get(`/v1/read/${streamName}`).then(handleReadSuccess).catch(handleFailure);
            service.get(`/v1/last/${streamName}`).then(handleLastSuccess).catch(handleFailure);
        }, 2 * 1000);
    };

    config.logger.debug('Created http client');

    return {
        testRun,
    };
};

module.exports = createClient;
