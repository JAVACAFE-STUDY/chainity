var Issue = require('../models/issue.model');
var User = require('../models/user.model');
var Participation = require('../models/participation.model');
var config = require('../config/config');
var Tx = require('ethereumjs-tx');
var Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider(config.web3Provider));
var erc20 = new web3.eth.Contract(JSON.parse(config.contractABI), config.contractAccount);

/**
 * Get issue list.
 * @property {number} req.query.offset - Number of issues to be skipped.
 * @property {number} req.query.limit - Limit number of issues to be returned.
 * @returns {Issue[]}
 */
async function list(req, res, next) {
  const { limit = 0, offset = 0 } = req.query;

  let result = {
    offset: req.query.offset,
    limit: req.query.limit,
    totalDocs: await Issue.count(),
    docs: await Issue.list({ limit, offset })
  };

  res.json(result);
}

/**
 * Create new issue
 * @property {string} req.body.title
 * @property {string} req.body.description
 * @property {string} req.body.tokens
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
    tokens: req.body.tokens,
    maxNumberOfParticipants: req.body.maxNumberOfParticipants,
    startDate: req.body.startDate,
    finishDate: req.body.finishDate,
    participants: req.body.participants,
    isClosed: false,
    createdAt: Date.now(),
    createdBy: req.decoded._id
  });

  issue.save()
    .then(savedIssue=> res.json(savedIssue))
    .catch(e => next(e));
}

/**
 * Load issue and append to req.
 */
function load(req, res, next, issueId) {
  Issue.get(issueId)
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
  const issue = new Issue(req.issue);
  if (req.body.title != '') {
    issue.title = req.body.title;
  }
  if (req.body.description != '') {
    issue.description = req.body.description;
  }
  if (req.body.maxNumberOfParticipants != '') {
    issue.maxNumberOfParticipants = req.body.maxNumberOfParticipants;
  }
  if (req.body.startDate != '') {
    issue.startDate = req.body.startDate;
  }
  if (req.body.finishDate != '') {
    issue.finishDate = req.body.finishDate;
  }
  if (req.body.isClosed != '') {
    issue.isClosed = req.body.isClosed;
  }
  if (req.body.closedAt != '') {
    issue.closedAt = req.body.closedAt;
  }

  Issue.update({ id: issue.id}, issue)
    .then(savedIssue => res.json(savedIssue))
    .catch(e => next(e));
}

/**
 * Delete issue.
 * @returns {Issue}
 */
function remove(req, res, next) {
  // Issue.remove({ id: parseInt(id) })
  //   .then(deletedIssue => res.json(deletedIssue))
  //   .catch(e => next(e));
  const issue = req.issue;
  issue.remove()
    .then(deletedIssue => res.json(deletedIssue))
    .catch(e => next(e));
}

/**
 * Add participant
 */
function addParticipant(req, res, next) {
  var userId = req.params.userId;

  if('me' === userId) {
    userId = req.decoded._id;
  }

  const issue = new Issue(req.issue);

  Issue.update({ id: issue.id}, { $addToSet: { participants: userId } })
    .then(savedIssue => res.json(savedIssue))
    .catch(e => next(e));
}

function addTransaction(req, res, next) {
  const issue = new Issue(req.issue);
  Issue.update({ id: issue.id}, { $addToSet: { transactions: req.params.transactionId } })
    .then(savedIssue => res.json(savedIssue))
    .catch(e => next(e));
}

/**
 * Remove participant
 */
function removeParticipant(req, res, next) {
  var userId = req.params.userId;
  if('me' === userId) {
    userId = req.decoded._id;
  }

  const issue = new Issue(req.issue);

  Issue.update({ id: issue.id}, { $pull: { participants: userId } })
    .then(savedIssue => res.json(savedIssue))
    .catch(e => next(e));
}

/**
 * Add rewarded participants
 */
function addRewardedParticipants(req, res, next) {
  var userId = req.params.userId;
  if('me' === userId) {
    userId = req.decoded._id;
  }

  const issue = new Issue(req.issue);

  // Issue.update({ id: issue.id}, { $pull: { participants: userId }, $addToSet: { rewardedParticipants: userId } })
  //   .then(savedIssue => res.json(savedIssue))
  //   .catch(e => next(e)); 
  Issue.update({ id: issue.id}, { $pull: { participants: userId } })
    .then(savedIssue => res.json(savedIssue))
    .catch(e => next(e));
  
  Issue.update({ id: issue.id}, { $addToSet: { rewardedParticipants: userId } })
    .then(savedIssue => res.json(savedIssue))
    .catch(e => next(e));
}

module.exports = { list, create, load, get, update, remove, addParticipant, removeParticipant, addRewardedParticipants, addTransaction };
