const handleSuccess = (c) => {
    c.res.sendStatus(HTTP_STATUS_ACCEPTED);
    return c;
};

module.exports = handleSuccess;
