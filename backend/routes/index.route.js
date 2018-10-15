var express = require('express');
var expressJwt = require('express-jwt');
var config = require('../config/config');
var authRoutes = require('./auth.route');
var userRoutes = require('./user.route');
var issueRoutes = require('./issue.route');
var mailRoutes = require('./mail.route');
var bankRoutes = require('./bank.route');
var transactions = require('./transaction.route');
var tokensRequestRoutes = require('./tokensRequest.route');
var contractRoutes = require('./contract.route');
var imageRoutes = require('./image.route');

const router = express.Router(); // eslint-disable-line new-cap
const auth = expressJwt({secret: config.jwtSecret, requestProperty: 'decoded'});

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount auth routes at /auth
router.use('/auth', authRoutes);

router.use('/users', auth, userRoutes);

// mount issue routes at /issues
router.use('/issues', auth, issueRoutes);

// mount mail routes at /mails
router.use('/mails', auth, mailRoutes);

// mount tokens requests routes at /tokens-requests
router.use('/tokens-requests', auth, tokensRequestRoutes);

// mount bank routes at /banks
router.use('/banks', auth, bankRoutes);

// mount contract routes at /contracts
router.use('/contracts', auth, contractRoutes);

// mount transaction routes at /transactions
router.use('/transactions', auth, transactions);

// mount image routes at /image
router.use('/images', imageRoutes);

module.exports = router;