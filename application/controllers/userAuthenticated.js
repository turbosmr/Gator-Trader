module.exports = {
    // Check if user is logged as student
    ensureStudentAuthenticated: (req, res, next) => {
        if (req.isAuthenticated() && req.user.sid) {
            return next();
        }
        req.flash('error', 'Please log in');
        res.redirect('/user/login?redirectUrl=' + req.originalUrl);
    },
    // Check if user is logged as administrator
    ensureAdminAuthenticated: (req, res, next) => {
        if (req.isAuthenticated() && req.user.aid) {
            return next();
        }
        req.flash('error', 'Please log in');
        res.redirect('/admin/login');
    },
    // Check if user is already logged in as student or administrator
    forwardAuthenticated: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next();
        }
        else {
            if (req.user.sid) {
                res.redirect('/user/dashboard');
            }
            else if (req.user.aid) {
                res.redirect('/admin/dashboard');
            }
        }
    }
}