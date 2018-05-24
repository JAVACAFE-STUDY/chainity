var express = require('express');
var authRoutes = require('./auth.route');
var userRoutes = require('./user.route');
var issueRoutes = require('./issue.route');
var mailRoutes = require('./mail.route');
var balanceRoutes = require('./balance.route');


const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount user routes at /users
router.use('/users', userRoutes);

// mount issue routes at /issue
router.use('/issue', issueRoutes);

// mount mail routes at /mails
router.use('/mails', mailRoutes);

// mount mail routes at /balance
router.use('/balance', balanceRoutes);

module.exports = router;