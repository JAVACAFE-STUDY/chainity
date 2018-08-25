var express = require('express');
var imageCtrl = require('../controllers/image.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/:userId/profile')
  .get(imageCtrl.profileImage)

router.route('/:userId/profile/thumbnail')
  .get(imageCtrl.profileThumbnail)

  module.exports = router;