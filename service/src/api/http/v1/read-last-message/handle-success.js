const handleSuccess = (c) => {
    c.res.json(c.result.message);
    return c;
};

module.exports = handleSuccess;
