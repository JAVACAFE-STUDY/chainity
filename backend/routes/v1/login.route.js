var express = require('express'),
    validate = require('express-validation');

var paramValidation = require('../../config/param-validation'),
    authCtrl = require('../../controllers/auth.controller'),
    userCtrl = require('../../controllers/user.controller');

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/')
  .post(validate(paramValidation.login), authCtrl.login);

module.exports = router;