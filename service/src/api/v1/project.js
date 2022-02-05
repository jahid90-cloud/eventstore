const createProject = ({ config, eventStore }) => {
    const project = (req, res) => {
        return res.send('Projected');
    };

    return project;
};

module.exports = createProject;
