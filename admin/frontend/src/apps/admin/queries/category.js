const camelCaseKeys = require('camelcase-keys');

const createCategoryQueries = ({ db, mdb }) => {
    const categories = () => {
        return db
            .then((client) =>
                client('admin_categories').orderBy('category_name', 'ASC')
            )
            .then(camelCaseKeys);
    };

    const categoryName = (categoryName) => {
        return mdb
            .then((client) =>
                client('messages')
                    .whereRaw('stream_name LIKE ?', [categoryName + '-%'])
                    .orderBy('global_position', 'asc')
            )
            .then(camelCaseKeys);
    };

    return {
        categories,
        categoryName,
    };
};

module.exports = createCategoryQueries;
