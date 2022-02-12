const { renderPaginatedMessages } = require('./utils');

const createTypeHandlers = ({ actions, queries }) => {
    const handleMessagesOfType = (req, res) => {
        const { type } = req.params;
        const { c: category } = req.query;

        return queries
            .messagesByType(type, category)
            .then((messages) =>
                renderPaginatedMessages(
                    req,
                    res,
                    messages,
                    'admin/templates/messages-index',
                    `Messages of type: ${type}`
                )
            );
    };

    const handleEventTypesIndex = (req, res) => {
        return queries
            .eventTypes()
            .then((eventTypes) =>
                res.render('admin/templates/event-types', { eventTypes })
            );
    };

    return {
        handleMessagesOfType,
        handleEventTypesIndex,
    };
};

module.exports = createTypeHandlers;
