var express = require('express');
var validate = require('express-validation');
var expressJwt = require('express-jwt');
var paramValidation = require('../config/param-validation');
var config = require('../config/config');
var balanceCtrl = require('../controllers/balance.controller');

const router = express.Router();

router.route('/:id')
  // GET /api/balance/:id - Get balance
  .get(balanceCtrl.get)

module.exports = router;