var express = require('express'),
    validate = require('express-validation');
    
var paramValidation = require('../../config/param-validation'),
    participationCtrl = require('../../controllers/participation.controller');;

const router = express.Router();

router.route('/')
  .get(participationCtrl.list);

module.exports = router;