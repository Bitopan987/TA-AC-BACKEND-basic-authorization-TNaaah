var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.user);
  if (req.user.isAdmin === 'true' && req.user) {
    return res.render('adminHomePage');
  } else if (req.user.isAdmin === 'false' && req.user) {
    let error = req.flash('error')[0];
    return res.render('userHomePage', { error });
  } else {
    req.flash('error', 'you must login first');
    return res.redirect('/users/login');
  }
});

module.exports = router;
