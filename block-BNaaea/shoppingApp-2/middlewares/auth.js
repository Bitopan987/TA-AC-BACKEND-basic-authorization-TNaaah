var User = require('../models/user');

module.exports = {
  loggdInUser: (req, res, next) => {
    if (req.user && req.session.userId) {
      next();
    } else {
      req.flash('error', 'You must be logged-In to perform this action');
      res.redirect('/users/login');
    }
  },
  UserInfo: (req, res, next) => {
    if (req.session && req.session.userId) {
      var userId = req.session.userId;
      User.findById(userId, (err, user) => {
        req.user = user;
        res.locals.user = user;
        next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  },
  urlInfo: (req, res, next) => {
    res.locals.url = req.url;
    next();
  },
  isAdmin: (req, res, next) => {
    if (req.user.isAdmin === 'true' && req.session) {
      next();
    } else {
      req.flash('error', 'you must login as admin');
      res.redirect('/home');
    }
  },
};
