var express = require('express');
var validate = require('express-validation');
var expressJwt = require('express-jwt');
var paramValidation = require('../config/param-validation');
var config = require('../config/config');
var issueCtrl = require('../controllers/issue.controller');

const router = express.Router();
const auth = expressJwt({secret: config.jwtSecret, requestProperty: 'decoded'});

router.route('/')
  // GET /api/issues - Get list of issue
  .get(auth, issueCtrl.list)
  // POST /api/issues - Create new issue
  .post(auth, issueCtrl.create);

router.route('/:id')
  // GET /api/issues/:id - Get issue
  .get(auth, issueCtrl.get)
  // PUT /api/issues/:id - Update issue
  .put(auth, issueCtrl.update)
  // DELETE /api/issues/:id - Delete issue
  .delete(auth, issueCtrl.remove);

// Load issue when API with issueId route parameter is hit
router.param('id', issueCtrl.load);

module.exports = router;