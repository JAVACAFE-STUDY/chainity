var express = require('express');
var validate = require('express-validation');
var expressJwt = require('express-jwt');
var paramValidation = require('../config/param-validation');
var config = require('../config/config');
var tokensRequestCtrl = require('../controllers/tokensRequest.controller');
const auth = expressJwt({secret: config.jwtSecret, requestProperty: 'decoded'})

const router = express.Router();

router.route('/')
  // GET /api/tokens-requests - Get list of purchase
  .get(tokensRequestCtrl.list)
  // POST /api/tokens-requests - Create new purchase
  .post(auth, tokensRequestCtrl.create);

router.route('/:id')
  // GET /api/tokens-requests/:id - Get purchase
  .get(auth, tokensRequestCtrl.get)
  // PUT /api/tokens-requests/:id - Update purchase
  .put(auth, tokensRequestCtrl.update)

// Load user when API with userId route parameter is hit
router.param('id', tokensRequestCtrl.load);

module.exports = router;