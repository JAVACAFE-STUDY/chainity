var express = require('express');
var validate = require('express-validation');
var expressJwt = require('express-jwt');
var paramValidation = require('../config/param-validation');
var config = require('../config/config');
var issueCtrl = require('../controllers/issue.controller');

const router = express.Router();

router.route('/')
  // GET /api/issue - Get list of issue
  .get(issueCtrl.list)
  // POST /api/issue - Create new issue
  .post(issueCtrl.create);

router.route('/:id')
  // GET /api/issue/:id - Get issue
  .get(issueCtrl.get)
  // PUT /api/issue/:id - Update issue
  .put(issueCtrl.update)
  // DELETE /api/issue/:id - Delete issue
  .delete(issueCtrl.remove);

// Load user when API with userId route parameter is hit
router.param('id', issueCtrl.load);

module.exports = router;