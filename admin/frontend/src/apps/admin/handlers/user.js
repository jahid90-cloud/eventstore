const { renderPaginatedMessages } = require('./utils');

const createUserHandlers = ({ actions, queries }) => {
    const handleUsersIndex = (req, res) => {
        return queries
            .usersIndex()
            .then((users) =>
                res.render('admin/templates/users-index', { users })
            );
    };

    const handleShowUser = (req, res) => {
        const userPromise = queries.user(req.params.id);
        const loginEventsPromise = queries.userLoginEvents(req.params.id);

        return Promise.all([userPromise, loginEventsPromise]).then((values) => {
            const user = values[0];
            const loginEvents = values[1];

            return res.render('admin/templates/user', {
                user,
                loginEvents,
            });
        });
    };

    const handleUserMessagesIndex = (req, res) => {
        const userId = req.params.userId;
        const isEvsContext = (req.query.evs && req.query.evs === '1') || false;

        return queries
            .userMessages(userId, isEvsContext)
            .then((messages) =>
                renderPaginatedMessages(
                    req,
                    res,
                    messages,
                    'admin/templates/messages-index',
                    'User Messages'
                )
            );
    };

    return {
        handleUsersIndex,
        handleShowUser,
        handleUserMessagesIndex,
    };
};

module.exports = createUserHandlers;
