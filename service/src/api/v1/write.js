const createWrite = ({ eventStore }) => {
    const write = (req, res) => {
        return res.send('Written');
    };

    return write;
};

module.exports = createWrite;
