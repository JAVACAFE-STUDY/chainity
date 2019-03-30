var express = require('express'),
    validate = require('express-validation');
    
var paramValidation = require('../../config/param-validation'),
    groupCtrl = require('../../controllers/group.controller'),
    userCtrl = require('../../controllers/user.controller'),
    eventCtrl = require('../../controllers/issue.controller'),
    aggsCtrl = require('../../controllers/aggs.controller');

const router = express.Router();

router.route('/')
  .get(groupCtrl.getTotalRewardTokens, groupCtrl.getTotalSupply);

router.route('/users')
  .get(userCtrl.list);

router.route('/events')
  .get(eventCtrl.list)

router.route('/participations')
  .get(groupCtrl.list);

router.route('/aggs/participations')
  .get(aggsCtrl.list);

module.exports = router;