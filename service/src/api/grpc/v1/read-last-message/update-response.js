const updateResponse = (c) => {
    c.response.setMessage(c.result.message);
    return c;
};

module.exports = updateResponse;
