const createViewHandlers = ({ actions, queries }) => {
    const handleViewsIndex = (req, res) => {
        return queries.views().then((views) => {
            return res.render('admin/templates/views-index', { views });
        });
    };

    const handleClearView = (req, res) => {
        const view = req.params.name;
        const referrer = req.get('referrer');
        const parsed = new URL(referrer);

        return actions
            .clearView(view)
            .then(() =>
                res.redirect(`${parsed.pathname}${parsed.search}${parsed.hash}`)
            );
    };

    const handleClearAllViews = (req, res) => {
        const views = JSON.parse(req.body.views);
        const referrer = req.get('referrer');
        const parsed = new URL(referrer);

        return actions
            .clearAllViews(views)
            .then(() =>
                res.redirect(`${parsed.pathname}${parsed.search}${parsed.hash}`)
            );
    };

    return {
        handleViewsIndex,
        handleClearView,
        handleClearAllViews,
    };
};

module.exports = createViewHandlers;
