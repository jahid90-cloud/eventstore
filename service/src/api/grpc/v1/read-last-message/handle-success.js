const handleSuccess = (c) => {
    c.callback(null, c.response);
    return c.actions.writeSuccessEvent(c);
};

module.exports = handleSuccess;
