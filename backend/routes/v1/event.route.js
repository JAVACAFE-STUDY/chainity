var express = require('express'),
    validate = require('express-validation');
    
var paramValidation = require('../../config/param-validation'),
    eventCtrl = require('../../controllers/event.controller'),
    participationCtrl = require('../../controllers/participation.controller'),
    rewardCtrl = require('../../controllers/reward.controller');

const router = express.Router();

router.route('/')
  .get(eventCtrl.list)
  .post(eventCtrl.create);

router.route('/:eventId')
  .get(eventCtrl.get)
  .put(eventCtrl.update)
  .delete(eventCtrl.remove);

router.route('/:eventId/participations')
  .get((req, res, next) => {
    req.query.q = { 'event': req.event._id };
    next();
  }, participationCtrl.list)
  .post(eventCtrl.addParticipation);

router.route('/:eventId/rewards')
  .get((req, res, next) => {
    req.query.q = { 'event': req.event._id };
    next();
  }, rewardCtrl.list);

router.route('/:eventId/participations/:participationId')
  .delete(eventCtrl.removeParticipation);

router.param('eventId', eventCtrl.load);

module.exports = router;
