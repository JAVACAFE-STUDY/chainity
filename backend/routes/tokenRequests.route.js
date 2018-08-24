var express = require('express');
var validate = require('express-validation');
var expressJwt = require('express-jwt');
var paramValidation = require('../config/param-validation');
var config = require('../config/config');
var tokenRequestsCtrl = require('../controllers/tokenRequests.controller');
const auth = expressJwt({secret: config.jwtSecret, requestProperty: 'decoded'})

const router = express.Router();

router.route('/')
  // GET /api/token-requests - Get list of purchase
  .get(tokenRequestsCtrl.list)
  // POST /api/token-requests - Create new purchase
  .post(auth, tokenRequestsCtrl.create);

router.route('/me')
  // GET /api/token-requests/me - Get list of purchase
  .get(auth, tokenRequestsCtrl.listMe)

router.route('/:id')
  // GET /api/token-requests/:id - Get purchase
  .get(tokenRequestsCtrl.get)
  // PUT /api/token-requests/:id - Update purchase
  .put(tokenRequestsCtrl.update)

// Load user when API with userId route parameter is hit
router.param('id', tokenRequestsCtrl.load);

module.exports = router;