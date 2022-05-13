const Bluebird = require('bluebird');

const createViewQueries = ({ db }) => {
    const views = () => {
        const views = [
            { name: 'admin_categories' },
            { name: 'admin_event_types' },
            { name: 'admin_entities' },
            { name: 'admin_streams' },
            { name: 'admin_subscriber_positions' },
            { name: 'admin_users' },
            { name: 'user_credentials' },
        ];

        return Bluebird.each(views, (view) => {
            return db
                .then((client) => client(view.name).count('* as count'))
                .then((total) => {
                    view.count = total[0].count;
                });
        });
    };

    return {
        views,
    };
};

module.exports = createViewQueries;
