const handleSuccess = (c) => {
    c.res.json(c.result.messages);
    return c;
};

module.exports = handleSuccess;
