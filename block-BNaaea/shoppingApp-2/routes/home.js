var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var User = require('../models/user');
var Product = require('../models/product');

/*GET home page.*/

router.get('/', function (req, res, next) {
  if (req.session.isAdmin === 'true' && req.session.userId) {
    User.find({}, (err, users) => {
      if (err) return next(err);
      Product.find({}, (err, products) => {
        if (err) return next(err);
        return res.render('adminHomePage', { users, products });
      });
    });
  } else if (req.session.isAdmin === 'false' && req.session.userId) {
    let error = req.flash('error')[0];
    return res.render('userHomePage', { error });
  } else {
    req.flash('error', 'you must login first');
    return res.redirect('/users/login');
  }
});

module.exports = router;
