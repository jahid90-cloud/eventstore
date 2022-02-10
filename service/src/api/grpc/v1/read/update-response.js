const updateResponse = (c) => {
    c.response.setMessagesList(c.result.messages);
    return c;
};

module.exports = updateResponse;
