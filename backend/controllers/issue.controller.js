var Issue = require('../models/issue.model');
var User = require('../models/user.model');
var config = require('../config/config');
var Tx = require('ethereumjs-tx');
var Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider(config.web3Provider));
var erc20 = new web3.eth.Contract(JSON.parse(config.contractABI), config.contractAccount);

/**
 * Get issue list.
 * @property {number} req.query.skip - Number of issues to be skipped.
 * @property {number} req.query.limit - Limit number of issues to be returned.
 * @returns {Issue[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Issue.list({ limit, skip })
    .then(issues => res.json(issues))
    .catch(e => next(e));
}

/**
 * Create new issue
 * @property {string} req.body.title
 * @property {string} req.body.description
 * @property {string} req.body.price
 * @property {string} req.body.maxNumberOfParticipants
 * @property {string} req.body.startDate
 * @property {string} req.body.finishDate
 * @property {string} req.body.participants
 * @returns {Issue}
 */
function create(req, res, next) {
  const issue = new Issue({
    issueType: req.body.issueType,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    maxNumberOfParticipants: req.body.maxNumberOfParticipants,
    startDate: req.body.startDate,
    finishDate: req.body.finishDate,
    participants: req.body.participants,
    isClosed: false,
    createdDate: Date.now(),
    createdBy: req.decoded._id
  });

  issue.save()
    .then(savedIssue=> res.json(savedIssue))
    .catch(e => next(e));
}

/**
 * Load issue and append to req.
 */
function load(req, res, next, id) {
  Issue.get(id)
    .then((issue) => {
      req.issue = issue;
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get issue
 * @returns {issue}
 */
function get(req, res) {
  return res.json(req.issue);
}

/**
 * Update existing issue
 */
function update(req, res, next) {
  const issue = req.issue;
  issue[0].assignee_email = req.body.selected;
  issue[0].status = req.body.status;

  Issue.update({id: issue[0].id}, issue[0])
    .then(savedIssue => res.json(savedIssue))
    .catch(e => next(e));
}

/**
 * Delete issue.
 * @returns {Issue}
 */
function remove(req, res, next, id) {
  const issue = req.issue;
  issue.remove({ id: parseInt(id) })
    .then(deletedIssue => res.json(deletedIssue))
    .catch(e => next(e));
}

module.exports = { list, create, load, get, update, remove };