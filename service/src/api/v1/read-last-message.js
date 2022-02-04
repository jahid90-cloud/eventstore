const createReadLastMessage = ({ eventStore }) => {
    const readLastMessage = (req, res) => {
        return res.send('Read Last Message');
    };

    return readLastMessage;
};

module.exports = createReadLastMessage;
