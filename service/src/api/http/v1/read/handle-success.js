const handleSuccess = (c) => {
    c.res.json(c.result.messages);
    return c.actions.writeSuccessEvent(c);
};

module.exports = handleSuccess;
