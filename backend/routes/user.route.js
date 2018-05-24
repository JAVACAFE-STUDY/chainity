var express = require('express');
var validate = require('express-validation');
var expressJwt = require('express-jwt');
var paramValidation = require('../config/param-validation');
var config = require('../config/config');
var userCtrl = require('../controllers/user.controller');

const router = express.Router(); // eslint-disable-line new-cap
const auth = expressJwt({secret: config.jwtSecret, requestProperty: 'decoded'})

router.route('/')
  /** GET /api/users - Get list of users */
  .get(auth, userCtrl.list)

  /** POST /api/users - Create new user */
  .post(auth, validate(paramValidation.createUser), userCtrl.create);


router.route('/me')
  /** GET /api/users/me - Get current user */
  .get(auth, function(req, res, next){
    userCtrl.load(req, res, next, req.decoded._id)
  }, userCtrl.get)

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(auth, userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(auth, validate(paramValidation.updateUser), userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(auth, userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

module.exports = router;