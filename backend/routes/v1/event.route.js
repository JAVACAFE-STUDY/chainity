var express = require('express'),
    validate = require('express-validation');
    
var paramValidation = require('../../config/param-validation'),
    eventCtrl = require('../../controllers/event.controller');

const router = express.Router();

router.route('/')
  .get(eventCtrl.list)
  .post(eventCtrl.create);

router.route('/:eventId')
  .get(eventCtrl.get)
  .put(eventCtrl.update)
  .delete(eventCtrl.remove);

router.route('/:eventId/participations')
  .get(eventCtrl.getEventParticipations);

router.route('/:eventId/participations/:participationId')
  .put(eventCtrl.addParticipation)
  .delete(eventCtrl.removeParticipation);

router.param('eventId', eventCtrl.load);

module.exports = router;