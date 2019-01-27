var express = require('express');
var validate = require('express-validation');
var paramValidation = require('../config/param-validation');
var userCtrl = require('../controllers/user.controller');
var tokensRequestCtrl = require('../controllers/tokensRequest.controller');
var contractCtrl = require('../controllers/contract.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get users */
  .get(userCtrl.list)
  /** POST /api/users - Create user */
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(userCtrl.get)
  /** PUT /api/users/:userId - Update user */
  .put(validate(paramValidation.updateUser), userCtrl.update)
  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.remove);

router.route('/:userId/system')
  /** GET /api/users/system - Get system */
  .get(userCtrl.getSystem)

router.route('/:userId/tokens-requests')
/** GET /api/users/:userId/tokens-requests - Get my tokens requests */
.get(tokensRequestCtrl.listMine)

router.route('/:userId/tokens')
  /** GET /api/users/:userId/tokens - Get user tokens */
  .get((req, res, next) => contractCtrl.load(req, res, next), contractCtrl.getUserTokens)

router.route('/:userId/tokens-allowance')
  /** GET /api/users/:userId/tokens-allowance - Get user tokens allowance */
  .get((req, res, next) => contractCtrl.load(req, res, next), contractCtrl.getUserTokensAllowance)

router.route('/:userId/coins')
  /** GET /api/users/:userId/coins - Get user coins */
  .get(contractCtrl.getUserCoins)
  .post(contractCtrl.sendCoins);

// need refactoring
router.route('/:userId/images/profile')
  .post(userCtrl.uploadImage)

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

module.exports = router;