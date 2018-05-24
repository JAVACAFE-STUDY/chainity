var Purchase = require('../models/purchase.model');

/**
 * Get issue list.
 * @property {number} req.query.skip - Number of issues to be skipped.
 * @property {number} req.query.limit - Limit number of issues to be returned.
 * @returns {Issue[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Purchase.list({ limit, skip })
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
  const purchase = new Purchase({
    email: req.body.email,
    name: req.body.name,
    balance: req.body.balance,
    status: 'active',
    registered: Date()
  });

  purchase.save()
    .then(savedIssue=> res.json(savedIssue))
    .catch(e => next(e));
}

/**
 * Load issue and append to req.
 */
function load(req, res, next, id) {
  Purchase.get(id)
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
 * @property {string} req.body.assignees - The assignees of issue.
 * @returns {User}
 */
function update(req, res, next) {
  const issue = req.issue;
  issue.assignees = req.body.assignees;

  issue.save()
    .then(savedIssue => res.json(savedIssue))
    .catch(e => next(e));
}

module.exports = { list, create, load, get, update };