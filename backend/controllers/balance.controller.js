var config = require('../config/config');
var Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider(config.web3Provider));
var erc20 = new web3.eth.Contract(JSON.parse(config.contractABI), config.contractAccount);

/**
 * Get balance
 * @returns {balance}
 */
function get(req, res) {
	var balance = erc20.methods.balanceOf(req.params.id).call().then(function (result) {
		return res.send(numberWithCommas(result));
    });
}

function numberWithCommas (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

module.exports = { get };