var express = require('express');
var validate = require('express-validation');
var expressJwt = require('express-jwt');
var paramValidation = require('../config/param-validation');
var config = require('../config/config');
var contractCtrl = require('../controllers/contract.controller');

const router = express.Router();
const auth = expressJwt({secret: config.jwtSecret, requestProperty: 'decoded'});

router.route('/:id/tokens')
  .get(auth, contractCtrl.getTotalSupply)
  .post(auth, contractCtrl.sendToken)

router.route('/:id/approval')
  .post(auth, contractCtrl.approval)
  
router.route('/:id/receipts')
  .get(auth, contractCtrl.getReceiptList)

router.param('id', contractCtrl.load);

module.exports = router;