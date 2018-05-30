var Purchase = require('../models/purchase.model');

/**
 * Get Purchase list.
 * @property {number} req.query.skip - Number of issues to be skipped.
 * @property {number} req.query.limit - Limit number of issues to be returned.
 * @returns {Purchase[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Purchase.list({ limit, skip })
    .then(issues => res.json(issues))
    .catch(e => next(e));
}

/**
 * Create new Purchase
 * @property {string} req.body.email
 * @property {string} req.body.name
 * @property {string} req.body.balance
 * @returns {Purchase}
 */
function create(req, res, next) {
  const purchase = new Purchase({
    email: req.body.email,
    name: req.body.name,
    balance: req.body.balance,
    status: 'Pending',
    registered: Date()
  });

  purchase.save()
    .then(savedIssue=> res.json(savedIssue))
    .catch(e => next(e));
}

/**
 * Load Purchase and append to req.
 */
function load(req, res, next, id) {
  Purchase.get(id)
    .then((purchase) => {
      req.purchase = purchase;
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get Purchase
 * @returns {Purchase}
 */
function get(req, res) {
  return res.json(req.purchase);
}

/**
 * Update existing Purchase
 * @property {string} req.body.assignees - The assignees of Purchase.
 * @returns {Purchase}
 */
function update(req, res, next) {
  const purchase = req.purchase[0]
  purchase.status = req.body.status

  Purchase.update({id: purchase.id}, purchase)
    .then(purchase => res.json(purchase))
    .catch(e => next(e));
}

module.exports = { list, create, load, get, update };