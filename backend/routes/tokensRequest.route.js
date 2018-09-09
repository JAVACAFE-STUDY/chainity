var express = require('express');
var validate = require('express-validation');
var paramValidation = require('../config/param-validation');
var tokensRequestCtrl = require('../controllers/tokensRequest.controller');

const router = express.Router();

router.route('/')
  // GET /api/tokens-requests - Get list of purchase
  .get(tokensRequestCtrl.list)
  // POST /api/tokens-requests - Create new purchase
  .post(tokensRequestCtrl.create);

router.route('/:id')
  // GET /api/tokens-requests/:id - Get purchase
  .get(tokensRequestCtrl.get)
  // PUT /api/tokens-requests/:id - Update purchase
  .put(tokensRequestCtrl.update)

// Load user when API with userId route parameter is hit
router.param('id', tokensRequestCtrl.load);

module.exports = router;