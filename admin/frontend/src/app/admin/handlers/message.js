const {
    category,
    identityFromStream,
    renderPaginatedMessages,
} = require('./utils');

const createMessageHandlers = ({ actions, queries }) => {
    const handleMessagesIndex = (req, res) => {
        return queries
            .messages()
            .then((messages) =>
                renderPaginatedMessages(
                    req,
                    res,
                    messages,
                    'admin/templates/messages-index'
                )
            );
    };

    const handleCorrelatedMessagesIndex = (req, res) => {
        const traceId = req.params.traceId;
        const isEvsContext = (req.query.evs && req.query.evs === '1') || false;

        return queries
            .correlatedMessages(traceId, isEvsContext)
            .then((messages) =>
                renderPaginatedMessages(
                    req,
                    res,
                    messages,
                    'admin/templates/messages-index',
                    'Correlated Messages'
                )
            );
    };

    const handleShowMessage = (req, res) => {
        const messageId = req.params.id;

        return queries
            .message(messageId)
            .then((message) => {
                return {
                    ...message,
                    category: category(message.streamName),
                    identityId: identityFromStream(message.streamName),
                };
            })
            .then((message) =>
                res.render('admin/templates/message', { message })
            );
    };

    const handleDeleteMessage = (req, res) => {
        const messageId = req.params.id;
        const referrer = req.get('referrer');
        const parsed = new URL(referrer);

        return actions
            .deleteMessage(messageId)
            .then(() =>
                res.redirect(`${parsed.pathname}${parsed.search}${parsed.hash}`)
            );
    };

    const handleDeleteAllMessages = (req, res) => {
        const ids = JSON.parse(req.body.messages);
        const referrer = req.get('referrer');
        const parsed = new URL(referrer);

        return actions
            .deleteAllMessages(ids)
            .then(() =>
                res.redirect(`${parsed.pathname}${parsed.search}${parsed.hash}`)
            );
    };

    const handleResendMessage = (req, res) => {
        const messageId = req.params.id;
        const referrer = req.get('referrer');
        const parsed = new URL(referrer);

        return actions
            .resendMessage(messageId)
            .then(() =>
                res.redirect(`${parsed.pathname}${parsed.search}${parsed.hash}`)
            );
    };

    return {
        handleMessagesIndex,
        handleCorrelatedMessagesIndex,
        handleShowMessage,
        handleDeleteMessage,
        handleDeleteAllMessages,
        handleResendMessage,
    };
};

module.exports = createMessageHandlers;
