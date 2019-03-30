var express = require('express'),
    expressJwt = require('express-jwt');

var config = require('../../config/config'),
    authRoutes = require('./auth.route'),
    userRoutes = require('./user.route'),
    eventRoutes = require('./event.route'),
    aggsRoutes = require('./aggs.route'),
    groupRoutes = require('./group.route');

const router = express.Router();
const auth = expressJwt({secret: config.jwtSecret, requestProperty: 'decoded'});

router.use('/groups/:groupId/auth', authRoutes);

// router.use('/groups/:groupId/users', auth, userRoutes);
router.use('/groups/:groupId/users', userRoutes);

// router.use('/groups/:groupId/events', auth, eventRoutes);
router.use('/groups/:groupId/events', eventRoutes);

router.use('/groups/:groupId/aggs/participations', aggsRoutes);

router.use('/groups/:groupId', groupRoutes);

router.param('groupId', (req, res, next, id) => {
  // Get group name from groupId
  req.groupId = id;
  req.groupName = 'JAVA-CAFE';
  next();
});

module.exports = router;