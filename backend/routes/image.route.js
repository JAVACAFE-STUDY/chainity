var express = require('express');
var imageCtrl = require('../controllers/image.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/:relPath')
  .get(imageCtrl.get)

router.param('relPath', imageCtrl.load);

module.exports = router;