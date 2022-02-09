const createAttachLocals = ({ config }) => {
    const attachLocals = (req, res, next) => {
        res.locals.context = req.context;

        next();
    };

    config.logger.debug('Created attach http locals');

    return attachLocals;
};

module.exports = createAttachLocals;
