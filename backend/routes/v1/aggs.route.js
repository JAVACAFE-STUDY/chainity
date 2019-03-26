var express = require('express'),
    validate = require('express-validation');
    
var paramValidation = require('../../config/param-validation'),
    aggsCtrl = require('../../controllers/aggs.controller');

const router = express.Router();

router.route('/')
  .get(aggsCtrl.list);

module.exports = router;