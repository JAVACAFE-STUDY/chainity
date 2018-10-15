var express = require('express');
var transactionCtrl = require('../controllers/transaction.controller');

const router = express.Router();

router.route('/')
  // GET /api/transactions - Get list of transaction
  .get(transactionCtrl.list)
  // POST /api/transactions - Create new transaction
  .post(transactionCtrl.create);

module.exports = router;