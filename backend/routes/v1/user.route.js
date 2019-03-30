var express = require('express'),
    validate = require('express-validation');
    
var paramValidation = require('../../config/param-validation'),
    userCtrl = require('../../controllers/user.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(userCtrl.list)
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId')
  .get(userCtrl.get)
  .put(validate(paramValidation.updateUser), userCtrl.update)
  .delete(userCtrl.remove);

router.param('userId', userCtrl.load);

module.exports = router;