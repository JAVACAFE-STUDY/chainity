var express = require('express'),
    validate = require('express-validation');
    
var paramValidation = require('../../config/param-validation'),
    rewardCtrl = require('../../controllers/reward.controller');

const router = express.Router();

router.route('/')
  .get(rewardCtrl.list);

module.exports = router;