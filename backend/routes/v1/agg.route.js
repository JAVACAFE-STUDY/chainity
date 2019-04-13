var express = require('express'),
    validate = require('express-validation');
    
var paramValidation = require('../../config/param-validation'),
    aggsCtrl = require('../../controllers/agg.controller');

const router = express.Router();

router.route('/participations')
  .get(aggsCtrl.aggParticipations);

module.exports = router;