var express = require('express');
var validate = require('express-validation');
var expressJwt = require('express-jwt');
var paramValidation = require('../config/param-validation');
var mailCtrl = require('../controllers/mail.controller');
var userCtrl = require('../controllers/user.controller');
var config = require('../config/config');

const router = express.Router(); // eslint-disable-line new-cap
const auth = expressJwt({secret: config.jwtSecret, requestProperty: 'decoded'})

router.route('/invitation/users/:userId')

  /** POST /api/mail/invitation/users/:email - Send new user invitation*/
  .post(auth, validate(paramValidation.sendInvitation), function(req, res, next){
    req.receiver = req.user;
    next();
  }, function(req, res, next) {
    userCtrl.load(req, res, next, req.decoded._id);
  }, mailCtrl.sendInvitation);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

module.exports = router;