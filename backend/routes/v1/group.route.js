var express = require('express'),
    validate = require('express-validation');
    
var paramValidation = require('../../config/param-validation'),
    contractCtrl = require('../../controllers/contract.controller'),
    groupCtrl = require('../../controllers/group.controller');

const router = express.Router();

router.route('/')
  .get(groupCtrl.getTotalRewardTokens, groupCtrl.getTotalSupply);

router.route('/participations')
  .get(groupCtrl.list);

module.exports = router;