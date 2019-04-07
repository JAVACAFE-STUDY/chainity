var Reward = require('../models/reward.model');
var config = require('../config/config');
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

module.exports = { getTotalRewardTokens, getTotalSupply };
