var express = require('express');
var authRoutes = require('./auth.route');
var userRoutes = require('./user.route');
var issueRoutes = require('./issue.route');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount user routes at /users
router.use('/users', userRoutes);

// mount user routes at /issue
router.use('/issue', issueRoutes);

module.exports = router;