var config = require('../config/config');
var Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider(config.web3Provider));
var TokenRequest = require('../models/tokenRequests.model');

/**
 * Get TokenRequest list.
 * @property {number} req.query.skip - Number of issues to be skipped.
 * @property {number} req.query.limit - Limit number of issues to be returned.
 * @returns {TokenRequest[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  TokenRequest.list({ limit, skip })
    .then(issues => res.json(issues))
    .catch(e => next(e));
}

/**
 * Create new TokenRequest
 * @property {string} req.body.email
 * @property {string} req.body.name
 * @property {string} req.body.balance
 * @returns {Purchase}
 */
function create(req, res, next) {
  const tokenRequest = new TokenRequest({
    userId: req.decoded._id,
    name: req.body.name,
    tokens: req.body.tokens,
    receiver: req.decoded.address,
    status: 'Pending',
    registered: Date()
  });

  tokenRequest.save()
    .then(savedTokenRequest=> res.json(savedTokenRequest))
    .catch(e => next(e));
}

/**
 * Load TokenRequest and append to req.
 */
function load(req, res, next, id) {
  TokenRequest.get(id)
    .then((tokenRequest) => {
      req.tokenRequest = tokenRequest;
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get TokenRequest
 * @returns {TokenRequest}
 */
function get(req, res) {
  return res.json(req.tokenRequest);
}

/**
 * Update existing TokenRequest
 * @property {string} req.body.assignees - The assignees of TokenRequest.
 * @returns {TokenRequest}
 */
function update(req, res, next) {
  const tokenRequest = req.tokenRequest[0]
  tokenRequest.status = req.body.status
  tokenRequest.transactionHash = req.body.transactionHash

  TokenRequest.update({id: tokenRequest.id}, tokenRequest)
    .then(tokenRequest => {
      res.json(tokenRequest)
      // updateBlockNumber(tokenRequest)
    })
    .catch(e => next(e));
}

function updateBlockNumber(tokenRequest) {
  web3.eth.subscribe('newBlockHeaders', function(e, r) {
    web3.eth.getTransaction(tokenRequest.transactionHash, function(e,r) {
      if (r != null && r.blockNumber > 0) {
        tokenRequest.status = 'Success'
        tokenRequest.blockNumber = r.blockNumber
        TokenRequest.update({id: tokenRequest.id}, tokenRequest)
          .then(tokenRequest => console.log("r.blockNumber"))
          .catch(e => next(e));
      }
    });
  });
}

module.exports = { list, create, load, get, update };