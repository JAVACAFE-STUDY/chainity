var express = require('express');
var authRoutes = require('./auth.route');
var userRoutes = require('./user.route');
var issueRoutes = require('./issue.route');
var mailRoutes = require('./mail.route');
var balanceRoutes = require('./balance.route');
var bankRoutes = require('./bank.route')
var tokenRequestsRoutes = require('./tokenRequests.route')
var contractRoutes = require('./contract.route')

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount auth routes at /auth
router.use('/auth', authRoutes);

/**
* @swagger
* tags:
*   name: User
*   description: User management
* definitions:
*   User:
*     required:
*       - _id
*       - email
*       - status
*       - role
*       - createdAt
*     properties:
*       _id:
*         type: string
*         uniqueItems: true
*       email:
*         type: string
*         uniqueItems: true
*       name: 
*         type: string
*       status:
*         type: string
*       role:
*         type: string
*       createdAt:
*         type: integer
*       registeredAt:
*         type: integer
*       keyStore:
*         type: object
*/
router.use('/users', userRoutes);

// mount issue routes at /issues
router.use('/issues', issueRoutes);

// mount mail routes at /mails
router.use('/mails', mailRoutes);

// mount mail routes at /balance
router.use('/balance', balanceRoutes);

// mount mail routes at /token-requests
router.use('/token-requests', tokenRequestsRoutes);

// mount bank routes at /banks
router.use('/banks', bankRoutes);

// mount mail routes at /contracts
router.use('/contracts', contractRoutes);

module.exports = router;