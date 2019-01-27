var express = require('express');
var validate = require('express-validation');
var paramValidation = require('../config/param-validation');
var contractCtrl = require('../controllers/contract.controller');

const router = express.Router();

router.route('/:id/tokens')
  .get(contractCtrl.getTotalTokens)
  .post(contractCtrl.sendTokens)

router.route('/:id/transfer')
  .post(contractCtrl.transfer)

router.route('/:id/approval')
  .post(contractCtrl.approval)
  
router.route('/:id/receipts')
  .get(contractCtrl.getReceiptList)

router.param('id', contractCtrl.load);

module.exports = router;