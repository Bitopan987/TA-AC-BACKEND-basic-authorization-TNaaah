var express = require('express');
var router = express.Router();
var User = require('../models/User');
var auth = require('../middlewares/auth');

/* GET users listing. */

router.get('/', function (req, res, next) {
  console.log(req.session);
  res.render('users');
});

router.get('/dashboard', auth.loggedInUser, (req, res, next) => {
  console.log(req.user);
  User.findOne({ _id: req.session.userId }, (err, user) => {
    if (err) return next(err);
    res.render('dashboard', { user });
  });
});

router.get('/register', function (req, res, next) {
  res.render('register', { error: req.flash('error')[0] });
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    console.log(err, user);
    if (err) {
      if (err.name === 'ValidationError') {
        req.flash('error', err.message);
        return res.redirect('/users/register');
      }
      req.flash('error', 'This email is taken');
      return res.redirect('/users/register');
      // return res.json({ err });
    }

    res.redirect('/users/login');
  });
});

router.get('/login', (req, res, next) => {
  var error = req.flash('error')[0];
  res.render('login', { error });
});

router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Email/Password required');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    // no user
    if (!user) {
      req.flash('error', 'This email is not registered');
      return res.redirect('/users/login');
    }
    // compare password
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'Invalid Password');
        return res.redirect('/users/login');
      }
      // persist login user info
      req.session.userId = user.id;
      res.redirect('/users/dashboard');
    });
  });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
});

module.exports = router;
