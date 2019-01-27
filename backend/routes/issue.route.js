var express = require('express');
var validate = require('express-validation');
var paramValidation = require('../config/param-validation');
var issueCtrl = require('../controllers/issue.controller');

const router = express.Router();

router.route('/')
  // GET /api/issues - Get list of issue
  .get(issueCtrl.list)
  // POST /api/issues - Create new issue
  .post(issueCtrl.create);

router.route('/:issueId')
  // GET /api/issues/:issueId - Get issue
  .get(issueCtrl.get)
  // PUT /api/issues/:issueId - Update issue
  .put(issueCtrl.update)
  // DELETE /api/issues/:issueId - Delete issue
  .delete(issueCtrl.remove);

router.route('/:issueId/participants/:userId')
  // PUT /api/issues/:issueId/participants/:userId - Add participant in issue
  .put(issueCtrl.addParticipant)
  // DELETE /api/issues/:issueId/participants/:userId - Remove participant in issue
  .delete(issueCtrl.removeParticipant);

router.route('/:issueId/rewardedParticipants/:userId')
  // PUT /api/issues/:issueId/rewardedParticipants/:userId - Add rewarded participant in issue
  .put(issueCtrl.addRewardedParticipants);

router.route('/:issueId/transaction/:transactionId')
  // PUT /api/issues/:issueId/transaction/:transactionId - Add transaction in issue
  .put(issueCtrl.addTransaction);

// Load issue when API with issueId route parameter is hit
router.param('issueId', issueCtrl.load);

module.exports = router;