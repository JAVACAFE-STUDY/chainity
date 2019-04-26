var express = require('express');

var groupRoutes = require('./group.route');

const router = express.Router();

router.use('/groups', groupRoutes);

module.exports = router;