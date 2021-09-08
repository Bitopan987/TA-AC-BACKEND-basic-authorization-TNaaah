var User = require('../models/user');

module.exports = {
  currentLoggedUserInfo: (req, res, next) => {
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
};
