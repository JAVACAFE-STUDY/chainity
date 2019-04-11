var Event = require('../models/event.model');
var Participation = require('../models/participation.model');
var config = require('../config/config');
var Tx = require('ethereumjs-tx');
var Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider(config.web3Provider));
var erc20 = new web3.eth.Contract(JSON.parse(config.contractABI), config.contractAccount);
var ObjectId = (require('mongoose').Types.ObjectId);

/**
 * Get event list.
 * @property {number} req.query.offset - Number of events to be skipped.
 * @property {number} req.query.limit - Limit number of events to be returned.
 * @returns {Event[]}
 */
async function list(req, res, next) {
  if(req.query.keyword) {
    req.query.q = { $text: { $search: req.query.keyword } }
  }

  const { limit = 0, offset = 0, q = {} } = req.query;

  let docs = [];
  if(limit > 0) {
    docs = await Event.list({ limit, offset, q });
  }

  const result = {
    offset: offset,
    limit: limit,
    totalDocs: await Event.count(q),
    docs: docs
  };

  res.json(result);
}

/**
 * Create new event
 * @property {string} req.body.title
 * @property {string} req.body.description
 * @property {string} req.body.tokens
 * @property {string} req.body.maxNumberOfParticipants
 * @property {string} req.body.startDate
 * @property {string} req.body.finishDate
 * @property {string} req.body.participants
 * @returns {Event}
 */
function create(req, res, next) {
  const event = new Event({
    title: req.body.title,
    description: req.body.description,
    tokens: req.body.tokens,
    maxNumberOfParticipants: req.body.maxNumberOfParticipants,
    startDate: req.body.startDate,
    finishDate: req.body.finishDate,
    createdBy: req.decoded._id,
    eventType: req.body.eventType,
    isClosed: false,
    createdAt: Date.now()
  });

  event.save()
    .then(savedEvent=> res.json(savedEvent))
    .catch(e => next(e));
}

/**
 * Load event and append to req.
 */
function load(req, res, next, eventId) {
  Event.get({ _id: new ObjectId(req.params.eventId) })
    .then((event) => {
      req.event = event;
      return next();
    }) 
    .catch(e => next(e));
}

/**
 * Get event
 * @returns {Event}
 */
function get(req, res) {
  return res.json(req.event);
}

/**
 * Update existing event
 */
function update(req, res, next) {
  const event = new Event(req.event);
  if (req.body.title != '') {
    event.title = req.body.title;
  }
  if (req.body.description != '') {
    event.description = req.body.description;
  }
  if (req.body.maxNumberOfParticipants != '') {
    event.maxNumberOfParticipants = req.body.maxNumberOfParticipants;
  }
  if (req.body.startDate != '') {
    event.startDate = req.body.startDate;
  }
  if (req.body.finishDate != '') {
    event.finishDate = req.body.finishDate;
  }
  if (req.body.isClosed != '') {
    event.isClosed = req.body.isClosed;
  }
  if (req.body.closedAt != '') {
    event.closedAt = req.body.closedAt;
  }

  Event.update({ _id: event._id}, event)
    .then(savedEvent => res.json(savedEvent))
    .catch(e => next(e));
}

/**
 * Delete event.
 * @returns {Event}
 */
function remove(req, res, next) {
  const event = req.event;
  event.remove()
    .then(deletedEvent => res.json(deletedEvent))
    .catch(e => next(e));
}

/**
 * Add participation
 * @property {string} req.event._id
 * @property {string} req.params.participationId
 * @property {string} req.event.createdBy
 * @returns {Event}
 */
function addParticipation(req, res, next) {
  const participation = new Participation({
    event: req.event._id,
    participant: new ObjectId(req.params.participationId),
    createdAt: Date.now(),
    createdBy: req.event.createdBy
  });

  participation.save()
    .then(savedParticipation=> res.json(savedParticipation))
    .catch(e => next(e));
}

/**
 * Remove participation
 * @property {string} req.event._id
 * @property {string} req.params.participationId
 * @returns {Event}
 */
function removeParticipation(req, res, next) {
  const participant = new ObjectId(req.params.participationId);
  const q = { event: req.event._id, participant: participant };

  Participation.deleteOne(q)
    .then(removeParticipation => res.json(removeParticipation))
    .catch(e => next(e));
}

module.exports = { list, create, load, get, update, remove, addParticipation, removeParticipation };
