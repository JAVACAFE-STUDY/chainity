var express = require('express');
var authRoutes = require('./auth.route');
var userRoutes = require('./user.route');
var issueRoutes = require('./issue.route');
var mailRoutes = require('./mail.route');
var bankRoutes = require('./bank.route')
var tokensRequestRoutes = require('./tokensRequest.route')
var contractRoutes = require('./contract.route')
var imageRoutes = require('./image.route');

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
var express = require('express');
var expressJwt = require('express-jwt');
var config = require('../config/config');
const auth = expressJwt({secret: config.jwtSecret, requestProperty: 'decoded'})

router.use('/users', auth, userRoutes);

// mount issue routes at /issues
router.use('/issues', issueRoutes);

// mount mail routes at /mails
router.use('/mails', mailRoutes);

// mount tokens requests routes at /tokens-requests
router.use('/tokens-requests', tokensRequestRoutes);

// mount bank routes at /banks
router.use('/banks', bankRoutes);

// mount contract routes at /contracts
router.use('/contracts', contractRoutes);

// mount image routes at /image
router.use('/images', imageRoutes);

module.exports = router;