var express = require('express'),
    expressJwt = require('express-jwt');

var config = require('../../config/config'),
    loginRoutes = require('./login.route'),
    userRoutes = require('./user.route'),
    eventRoutes = require('./event.route'),
    aggsRoutes = require('./aggs.route'),
    groupRoutes = require('./group.route');

const router = express.Router();
const auth = expressJwt({secret: config.jwtSecret, requestProperty: 'decoded'});

router.use('/groups/:groupId/login', loginRoutes);

router.use('/groups/:groupId', groupRoutes);

router.param('groupId', (req, res, next, id) => {
  // Get group name from groupId
  req.groupId = id;
  req.groupName = 'JAVA-CAFE';
  next();
});

module.exports = router;