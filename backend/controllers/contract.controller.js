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
	var erc20 = new web3.eth.Contract(JSON.parse(config.contractABI), config.contractAccount);
	req.contract = erc20;
    return next();
}

function numberWithCommas (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function sendToken(req, res) {
	var nonce = web3.eth.getTransactionCount(req.body.sender)
    nonce.then(resultNonce => {
    	var Tx = require('ethereumjs-tx');
		var privateKey = new Buffer('d790bc5a1f0adf09629eaabd2986e431fa795324dbca3191236309aefc03ada0','hex')
		var data = req.contract.methods.transfer(req.body.receiver, req.body.tokens).encodeABI();

		var rawTx = {
		  nonce: web3.utils.toHex(resultNonce),
		  gasPrice: web3.utils.toHex(2550000),
		  gasLimit: web3.utils.toHex(3050000),
		  from: req.body.sender,
		  to: config.contractAccount,
		  value: '0x0',
		  data: data
		}

		var tx = new Tx(rawTx);
		tx.sign(privateKey);

		var serializedTx = tx.serialize();
		web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(error, hash) {
			console.log('hash: ' + hash);
			console.log('error message: ' + error);
			if (!error) {
				return res.send({"result" : "success", "hash" : hash})
			} else {
				return res.send({"result" : "error", "errorMessage" : error})
			}
		});
    })
}

module.exports = { getTotalSupply, getReceiptList, load, sendToken };