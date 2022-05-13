const { renderPaginatedMessages } = require('./utils');

const createEntityHandlers = ({ actions, queries }) => {
    const handleEntitiesIndex = (req, res) => {
        return queries.entities().then((entities) => {
            return res.render('admin/templates/entities-index', {
                entities,
            });
        });
    };

    const handleEntityMessagesIndex = (req, res) => {
        const entityId = req.params.id;

        return queries
            .entityMessages(entityId)
            .then((messages) =>
                renderPaginatedMessages(
                    req,
                    res,
                    messages,
                    'admin/templates/messages-index',
                    `Entity Messages: ${entityId}`
                )
            );
    };

    return {
        handleEntitiesIndex,
        handleEntityMessagesIndex,
    };
};

module.exports = createEntityHandlers;
