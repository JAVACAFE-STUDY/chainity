var express = require('express');
var validate = require('express-validation');
var expressJwt = require('express-jwt');
var paramValidation = require('../config/param-validation');
var config = require('../config/config');
var issueCtrl = require('../controllers/issue.controller');
var userCtrl = require('../controllers/user.controller');

const router = express.Router();
const auth = expressJwt({secret: config.jwtSecret, requestProperty: 'decoded'});

router.route('/')
  // GET /api/issues - Get list of issue
  .get(auth, issueCtrl.list)
  // POST /api/issues - Create new issue
  .post(auth, issueCtrl.create);

router.route('/:issueId')
  // GET /api/issues/:issueId - Get issue
  .get(auth, issueCtrl.get)
  // PUT /api/issues/:issueId - Update issue
  .put(auth, issueCtrl.update)
  // DELETE /api/issues/:issueId - Delete issue
  .delete(auth, issueCtrl.remove);

router.route('/:issueId/participants/:userId')
  // PUT /api/issues/:issueId/participants/:userId - Add participant in issue
  .put(auth, issueCtrl.addParticipant)
  // DELETE /api/issues/:issueId/participants/:userId - Remove participant in issue
  .delete(auth, issueCtrl.removeParticipant);

// Load issue when API with issueId route parameter is hit
router.param('issueId', issueCtrl.load);

module.exports = router;