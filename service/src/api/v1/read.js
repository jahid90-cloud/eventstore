const createRead = ({ eventStore }) => {
    const read = (req, res) => {
        return res.send('Read');
    };

    return read;
};

module.exports = createRead;
