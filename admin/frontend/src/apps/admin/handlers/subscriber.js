const Bluebird = require('bluebird');

const createSubscriberHandlers = ({ actions, queries }) => {
    const handleSubscriberPositions = (req, res) => {
        return queries.subscriberPositions().then((positions) =>
            res.render('admin/templates/subscriber-positions', {
                positions,
            })
        );
    };

    const handleSubscriberPositionReset = (req, res) => {
        const referrer = req.get('referrer');
        const parsed = new URL(referrer);

        const context = {
            traceId: req.context.traceId,
            userId: req.context.userId,
            subscriberId: req.params.id,
        };

        return Bluebird.resolve(context).then((context) => {
            return actions
                .resetSubscriberPosition(context)
                .then(() =>
                    res.redirect(
                        `${parsed.pathname}${parsed.search}${parsed.hash}`
                    )
                );
        });
    };

    return {
        handleSubscriberPositions,
        handleSubscriberPositionReset,
    };
};

module.exports = createSubscriberHandlers;
