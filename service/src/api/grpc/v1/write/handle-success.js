const handleSuccess = (c) => {
    c.callback(null, c.response);
    return c;
};

module.exports = handleSuccess;
