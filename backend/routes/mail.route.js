var express = require('express');
var validate = require('express-validation');
var paramValidation = require('../config/param-validation');
var mailCtrl = require('../controllers/mail.controller');
var userCtrl = require('../controllers/user.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/invitation/users/:userId')

  /* POST /api/mails/invitation/users/:email - Send new user invitation */
  .post(validate(paramValidation.sendInvitation), function(req, res, next){
    req.receiver = req.user;
    next();
  }, function(req, res, next) {
    userCtrl.load(req, res, next, req.decoded._id);
  }, mailCtrl.sendInvitation);

  router.route('/approval')
  /* POST /api/mails/approval - Send user approval */
  .post(mailCtrl.sendApprovalComplete);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

module.exports = router;