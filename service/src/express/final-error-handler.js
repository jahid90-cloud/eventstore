const createFinalErrorHandler = ({ config }) => {
    const finalErrorHandler = (err, req, res, next) => {
        const traceId = req.context ? req.context.evs_traceId : 'None';
        config.logger.error(`${traceId} ${err}`);

        return res.status(500).send('Internal Server Error');
    };

    config.logger.debug('Created final http error handler');

    return finalErrorHandler;
};

module.exports = createFinalErrorHandler;
