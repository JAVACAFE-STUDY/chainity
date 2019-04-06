var express = require('express'),
    validate = require('express-validation');
    
var loginRoutes = require('./login.route'),
    userRoutes = require('./user.route'),
    eventRoutes = require('./event.route'),
    aggsRoutes = require('./aggs.route'),
    rewardRoutes = require('./reward.route'),
    participationRoutes = require('./participation.route');

var paramValidation = require('../../config/param-validation'),
    groupCtrl = require('../../controllers/group.controller');

const router = express.Router();

// router.route('/')
//   .get(groupCtrl.list);

router.route('/:groupId')
  .get(groupCtrl.getTotalRewardTokens, groupCtrl.getTotalSupply);

router.use('/:groupId/login', loginRoutes);

router.use('/:groupId/participations', participationRoutes)

router.use('/:groupId/users', userRoutes);

router.use('/:groupId/events', eventRoutes);

router.use('/:groupId/rewards', rewardRoutes);

router.use('/:groupId/aggs/participations', aggsRoutes);

router.param('groupId', (req, res, next, id) => {
  // Get group name from groupId
  req.groupId = id;
  req.groupName = 'JAVA-CAFE';
  next();
});

module.exports = router;