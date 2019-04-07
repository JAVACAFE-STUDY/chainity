var User = require('../models/user.model');
var config = require('../config/config');
var Tx = require('ethereumjs-tx');
var Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider(config.web3Provider));
var erc20 = new web3.eth.Contract(JSON.parse(config.contractABI), config.contractAccount);

/**
 * Get aggs list.
 * @property {number} req.query.startDate
 * @property {number} req.query.endDate
 * @returns {User[]}
 */
function list(req, res, next) {
  const { startDate = '1000-01-01', endDate = '9999-12-31'} = req.query;
  User.aggsList(startDate, endDate)
    .then(docs => {
      for (i in docs) {
        var tokens = 0;
        for (j in docs[i].tokens) {
            tokens += docs[i].tokens[j].tokens;
        }
        docs[i].countOfPartipations = docs[i].countOfPartipations.length;
        docs[i].tokens = tokens;
        tokens = 0;
      }
      // countOfPartipations desc sort
      docs.sort(function (a, b) {
        return a.countOfPartipations < b.countOfPartipations;
      });
      // Delete if countOfPartipations is zero
      docs = docs.filter(function(item){ return item.countOfPartipations !== 0; });

      res.json({ docs: docs });
    })
    .catch(e => next(e));
}

module.exports = { list };
