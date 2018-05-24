var express = require('express');
var validate = require('express-validation');
var expressJwt = require('express-jwt');
var paramValidation = require('../config/param-validation');
var config = require('../config/config');
var purchaseCtrl = require('../controllers/purchase.controller');

const router = express.Router();

router.route('/')
  // GET /api/purchase - Get list of purchase
  .get(purchaseCtrl.list)
  // POST /api/purchase - Create new purchase
  .post(purchaseCtrl.create);

router.route('/:id')
  // GET /api/purchase/:id - Get purchase
  .get(purchaseCtrl.get)
  // PUT /api/purchase/:id - Update purchase
  .put(purchaseCtrl.update)

// Load user when API with userId route parameter is hit
router.param('id', purchaseCtrl.load);

module.exports = router;