var express = require('express');
var validate = require('express-validation');
var expressJwt = require('express-jwt');
var paramValidation = require('../config/param-validation');
var config = require('../config/config');
var userCtrl = require('../controllers/user.controller');

const router = express.Router(); // eslint-disable-line new-cap
const auth = expressJwt({secret: config.jwtSecret, requestProperty: 'decoded'})

router.route('/')
  /**
  * @swagger
  * /Users:
  *   get:
  *     summary: Get users
  *     tags: [User]
  *     responses:
  *       200:
  *         description: Users
  *         schema:
  *           $ref: '#/definitions/User'
  */
  .get(auth, userCtrl.list)

  /**
  * @swagger
  * /Users:
  *   post:
  *     summary: Create new user
  *     tags: [User]
  *     parameters:
  *       - name: user
  *         in: body
  *         required: true
  *         description: User that we want to create
  *         schema: 
  *           type: object
  *           required:
  *           - email
  *           - status
  *           - role
  *           properties:
  *             email: 
  *               type: string
  *               uniqueItems: true
  *             name: 
  *               type: string
  *             status:
  *              type: string
  *             role:
  *               type: string
  *             registerAt:
  *               type: integer
  *             keyStore:
  *               type: object
  *     responses:
  *       200:
  *         description: User is created
  *         schema:
  *           $ref: '#/definitions/User'
  */
  .post(auth, validate(paramValidation.createUser), userCtrl.create);

router.route('/me')
  /** GET /api/users/me - Get current user */
  .get(auth, function(req, res, next){
    userCtrl.load(req, res, next, req.decoded._id)
  }, userCtrl.get)

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(auth, userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(auth, validate(paramValidation.updateUser), userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(auth, userCtrl.remove);

router.route('/:userId/token')
  /** GET /api/users/:userId/token - Get user token */
  .get(userCtrl.getToken)

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

module.exports = router;