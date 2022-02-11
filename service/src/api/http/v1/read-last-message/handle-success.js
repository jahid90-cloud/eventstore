const handleSuccess = (c) => {
    c.res.json(c.result.message);
    return c.actions.writeSuccessEvent(c);
};

module.exports = handleSuccess;
