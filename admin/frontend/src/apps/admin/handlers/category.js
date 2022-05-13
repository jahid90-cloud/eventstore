const { renderPaginatedMessages } = require('./utils');

const createCategoryHandlers = ({ actions, queries }) => {
    const handleCategoriesIndex = (req, res) => {
        return queries
            .categories()
            .then((categories) =>
                res.render('admin/templates/categories-index', { categories })
            );
    };

    const handleShowCategory = (req, res) => {
        const categoryName = req.params.categoryName;

        return queries
            .categoryName(categoryName)
            .then((messages) =>
                renderPaginatedMessages(
                    req,
                    res,
                    messages,
                    'admin/templates/messages-index',
                    `Category: ${categoryName}`
                )
            );
    };

    return {
        handleCategoriesIndex,
        handleShowCategory,
    };
};

module.exports = createCategoryHandlers;
