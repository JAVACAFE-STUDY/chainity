var express = require('express'),
    validate = require('express-validation');
    
var paramValidation = require('../../config/param-validation'),
    userCtrl = require('../../controllers/user.controller')
    participationCtrl = require('../../controllers/participation.controller'),
    rewardCtrl = require('../../controllers/reward.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(userCtrl.list)
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId')
  .get(userCtrl.get)
  .put(validate(paramValidation.updateUser), userCtrl.update)
  .delete(userCtrl.remove);

router.route('/:userId/participations')
  .get((req, res, next) => {
    req.query.q = { 'participant': req.user._id };
    next();
  }, participationCtrl.list);

router.route('/:userId/rewards')
  .get((req, res, next) => {
    req.query.q = { 'rewardedUser': req.user._id };
    next();
  }, rewardCtrl.list);

router.param('userId', userCtrl.load);

module.exports = router;