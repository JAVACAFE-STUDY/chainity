var express = require('express');
var validate = require('express-validation');
var expressJwt = require('express-jwt');
var paramValidation = require('../config/param-validation');
var config = require('../config/config');
var issueCtrl = require('../controllers/issue.controller');

const router = express.Router();

router.route('/')
  // GET /api/issues - Get list of issue
  .get(issueCtrl.list)
  // POST /api/issues - Create new issue
  .post(issueCtrl.create);

router.route('/:id')
  // GET /api/issues/:id - Get issue
  .get(issueCtrl.get)
  // PUT /api/issues/:id - Update issue
  .put(issueCtrl.update)
  // DELETE /api/issues/:id - Delete issue
  .delete(issueCtrl.remove);

// Load user when API with userId route parameter is hit
router.param('id', issueCtrl.load);

module.exports = router;