var Reward = require('../models/reward.model');
var Participation = require('../models/participation.model');
var config = require('../config/config');
var Tx = require('ethereumjs-tx');
var Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider(config.web3Provider));
var erc20 = new web3.eth.Contract(JSON.parse(config.contractABI), config.contractAccount);

/**
 * Get total reward tokens.
 */
function getTotalRewardTokens(req, res, next) {
  Reward.getTotalRewardTokens()
    .then(tokens => {
      req.result = {
        _id: req.groupId,
        name: req.groupName,
        initialTokens: 0,
        usedTokens: (tokens[0]) ? tokens[0].totalTokens : 0
      };
      next();
    })
    .catch(e => next(e));
}

/**
 * Get total supply.
 */
function getTotalSupply(req, res, next) {
  erc20.methods.totalSupply().call()
	.then(function (balance) {
    req.result.initialTokens = balance;
    res.json(req.result);
	});
}

/**
 * Get participations list.
 * @property {number} req.query.offset - Number of issues to be skipped.
 * @property {number} req.query.limit - Limit number of issues to be returned.
 * @returns {Issue[]}
 */
function list(req, res, next) {
  const { limit = 0, offset = 0 } = req.query;
  Participation.list({ limit, offset })
    .then(participations => {
      let result = {
        totalDocs: participations.length,
        offset: req.query.offset,
        limit: req.query.limit,
        docs: participations
      };
      res.json(result);
    })
    .catch(e => next(e));
}

module.exports = { list, getTotalRewardTokens, getTotalSupply };
