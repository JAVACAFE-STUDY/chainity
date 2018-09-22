var config = require('../config/config');
var Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider(config.web3Provider));
var TokensRequest = require('../models/tokensRequest.model');

/**
 * Get TokensRequest list.
 * @property {number} req.query.skip - Number of issues to be skipped.
 * @property {number} req.query.limit - Limit number of issues to be returned.
 * @returns {TokensRequest[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  TokensRequest.list({ limit, skip })
    .then(tokensRequest => res.json(tokensRequest))
    .catch(e => next(e));
}

function listMine(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  TokensRequest.listByCreatedBy(req.decoded._id, { limit, skip })
    .then(tokensRequests => res.json(tokensRequests))
    .catch(e => next(e));
}

/**
 * Create new TokensRequest
 * @property {string} req.body.senderName
 * @property {string} req.body.price
 * @property {string} req.body.receiverBank
 * @property {string} req.body.receiverName
 * @property {string} req.body.receiverAccount
 * 
 * @returns {Purchase}
 */
function create(req, res, next) {
  const tokensRequest = new TokensRequest({
    createdAt: new Date(),
    createdBy: req.decoded._id,
    senderName: req.body.senderName,
    price: req.body.price,
    receiverBank: req.body.receiverBank,
    receiverName: req.body.receiverName,
    receiverAccount: req.body.receiverAccount
  });

  tokensRequest.save()
    .then(savedTokensRequest=> res.json(savedTokensRequest))
    .catch(e => next(e));
}

/**
 * Load TokensRequest and append to req.
 */
function load(req, res, next, id) {
  TokensRequest.get(id)
    .then((tokensRequest) => {
      req.tokensRequest = tokensRequest;
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get TokensRequest
 * @returns {TokensRequest}
 */
function get(req, res) {
  return res.json(req.tokensRequest);
}

/**
 * Update existing TokensRequest
 * @property {string} req.body.tx
 * @property {string} req.body.approvedAt
 * @returns {TokensRequest}
 */
function update(req, res, next) {
  const tokensRequest = new TokensRequest(req.tokensRequest);
  if (req.body.tx != '') {
    tokensRequest.tx = req.body.tx;
  }
  if (req.body.approvedAt != '') {
    tokensRequest.approvedAt = req.body.approvedAt;
  }
  console.log(tokensRequest)
  TokensRequest.update({_id: tokensRequest.id}, tokensRequest)
    .then(tokensRequest => {
      res.json(tokensRequest)
      // updateBlockNumber(tokensRequest)
    })
    .catch(e => next(e));
}

function updateBlockNumber(tokensRequest) {
  web3.eth.subscribe('newBlockHeaders', function(e, r) {
    web3.eth.getTransaction(tokensRequest.transactionHash, function(e,r) {
      if (r != null && r.blockNumber > 0) {
        tokensRequest.status = 'Success'
        tokensRequest.blockNumber = r.blockNumber
        TokensRequest.update({id: tokensRequest.id}, tokensRequest)
          .then(tokensRequest => console.log("r.blockNumber"))
          .catch(e => next(e));
      }
    });
  });
}

module.exports = { list, create, load, get, update, listMine };