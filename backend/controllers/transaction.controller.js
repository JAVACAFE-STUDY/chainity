var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var Transaction = require('../models/transaction.model');

/**
 * Get Transaction list.
 * @property {number} req.query.skip - Number of tansaction to be skipped.
 * @property {number} req.query.limit - Limit number of tansaction to be returned.
 * @returns {TokensRequest[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    Transaction.list({ limit, skip })
      .then(transaction => res.json(transaction))
      .catch(e => next(e));
  }
  
/**
 * Create new Transaction
 * @property {string} req.body.txHash - The txHash of Transaction.
 * @property {string} req.body.toAddress - The toAddress of Transaction.
 * @property {string} req.body.fromAddress - The fromAddress of Transaction.
 * @property {string} req.body.tokenValue - The tokenValue of Transaction.
 * @property {string} req.body.txType - The txType of Transaction.
 * @returns {User}
 */
function create(req, res, next) {
    const transaction = new Transaction({
        txHash: req.body.txHash,
        toAddress: req.body.receiverId,
        fromAddress: req.body.senderId,
        tokenValue: req.body.tokens,
        txType: req.body.txType
    });

    transaction.save()
        .then(savedTransaction => res.json(savedTransaction))
        .catch((e) => {
        next(new APIError(e.message, httpStatus.BAD_REQUEST));
    });
}

module.exports = { list, create };