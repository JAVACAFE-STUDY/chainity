var express = require('express');
var validate = require('express-validation');
var expressJwt = require('express-jwt');
var paramValidation = require('../config/param-validation');
var config = require('../config/config');
var purchaseCtrl = require('../controllers/tokenRequests.controller');

const router = express.Router();

router.route('/')
  // GET /api/token-requests - Get list of purchase
  .get(purchaseCtrl.list)
  // POST /api/token-requests - Create new purchase
  .post(purchaseCtrl.create);

router.route('/:id')
  // GET /api/token-requests/:id - Get purchase
  .get(purchaseCtrl.get)
  // PUT /api/token-requests/:id - Update purchase
  .put(purchaseCtrl.update)

// Load user when API with userId route parameter is hit
router.param('id', purchaseCtrl.load);

module.exports = router;