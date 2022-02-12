const Bluebird = require('bluebird');

const createViewActions = ({ db }) => {
    const clearView = (view) => {
        return db.then((client) => client(view).delete());
    };

    const clearAllViews = (views) => {
        return Bluebird.resolve(views)
            .then((views) => views.map((view) => view.name))
            .then((views) => views.map(clearView));
    };

    return {
        clearView,
        clearAllViews,
    };
};

module.exports = createViewActions;
