var config = require('../config/config');
var Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider(config.web3Provider));

function getTotalSupply(req, res) {
	req.contract.methods.totalSupply().call().then(function (result) {
		return res.send(numberWithCommas(result));
	});
}

function getReceiptList(req, res) {
	// req.contract.events.allEvents({
	// 	filter: {},
	// 	fromBlock: 0,
	// 	toBlock: 'latest'
	// }, function(error, events){ console.log('events:' + events); });
	req.contract.getPastEvents('Transfer', {
		filter: {},
		fromBlock: 0,
		toBlock: 'latest'
	}, function(error, events){ 
		return res.send(events);
	});
}

function load(req, res, next, id) {
	var erc20 = new web3.eth.Contract(JSON.parse(config.contractABI), id);
	req.contract = erc20;
    return next();
}

function numberWithCommas (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

module.exports = { getTotalSupply, getReceiptList, load };