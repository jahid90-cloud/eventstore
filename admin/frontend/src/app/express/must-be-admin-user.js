const mustBeLoggedIn = (req, res, next) => {
    if (!req.session.role || !req.session.role.includes('admin')) {
        return res.redirect('/auth/log-in');
    }

    return next();
};

module.exports = mustBeLoggedIn;
