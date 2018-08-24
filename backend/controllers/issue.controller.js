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
 * @property {string} req.body.title   - The title of issue.
 * @property {string} req.body.content - The content of issue.
 * @property {string} req.body.count   - The count of issue.
 * @property {string} req.body.rewards - The rewards of issue.
 * @property {string} req.body.dueDate - The dueate of issue.
 * @returns {Issue}
 */
function create(req, res, next) {
  const issue = new Issue({
    title: req.body.title,
    content: req.body.content,
    count: req.body.count,
    rewards: req.body.rewards,
    dueDate: req.body.dueDate,
    status: 'open'
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