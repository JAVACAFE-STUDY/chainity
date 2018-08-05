var config = require('../config/config');
var User = require('../models/user.model');
var Web3 = require('web3');
var Tx = require('ethereumjs-tx');
var APIError = require('../helpers/APIError');
var httpStatus = require('http-status');
var web3 = new Web3(new Web3.providers.HttpProvider(config.web3Provider));

function getTotalSupply(req, res) {
	req.contract.methods.totalSupply().call().then(function (result) {
		return res.send(numberWithCommas(result));
	});
}

function getReceiptList(req, res) {
	req.contract.getPastEvents('Transfer', {
		fromBlock: 0,
		toBlock: 'latest'
	}, function(error, events){
		var eventsArray = []
		for (i in events) {
			eventsArray.push({"from" : events[i].returnValues.from, "to" : events[i].returnValues.to, "value" : events[i].returnValues.value})
		}
		return res.send(eventsArray);
	})
	// req.contract.getPastEvents('Transfer', {
	// 	filter: {to: req.decoded.address},
	// 	fromBlock: 0,
	// 	toBlock: 'latest'
	// }, function(error, events){ 
	// 	return res.send(events);
	// });
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
	var nonce = web3.eth.getTransactionCount('0x' + req.body.user.keyStore.address)
    nonce.then(resultNonce => {
    	var Tx = require('ethereumjs-tx');
    	var walletInfo = web3.eth.accounts.decrypt(req.body.user.keyStore, req.body.password);
		var privateKey = new Buffer(walletInfo.privateKey.replace('0x', ''), 'hex')

		// var data = req.contract.methods.transfer(req.body.receiver, req.body.tokens).encodeABI();
		var data = req.contract.methods.transferFrom(config.systemAddress, req.body.receiver, req.body.tokens).encodeABI();

		var rawTx = {
		  nonce: web3.utils.toHex(resultNonce),
		  gasPrice: web3.utils.toHex(2550000),
		  gasLimit: web3.utils.toHex(3050000),
		  from: '0x' + req.body.user.keyStore.address,
		  to: config.contractAccount,
		  value: '0x0',
		  data: data
		}

		var tx = new Tx(rawTx);
		tx.sign(privateKey);

		var serializedTx = tx.serialize();
		web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(error, hash) {
		  if (!error) {
	  	    	console.log("success " + hash)
				return res.send({"result" : "success", "hash" : hash})
			} else {
				console.log("error " + error)
				return res.send({"result" : "error", "errorMessage" : error})
			}
		});
    })
}

function approval(req, res, next) {
	const spender = req.body.spender;
	const tokens = req.body.tokens;
	const password = req.body.password;

	User.get(req.decoded._id)
    .then((user) => {
		const tokenOwner = user.keyStore.address;

		var walletInfo = web3.eth.accounts.decrypt(user.keyStore, password);
		var privateKey = new Buffer(walletInfo.privateKey.replace('0x', ''), 'hex')
		var data = req.contract.methods.approve(spender, tokens).encodeABI();

		var rawTx = {
			gasPrice: web3.utils.toHex(2550000),
			gasLimit: web3.utils.toHex(3050000),
			from: '0x' + tokenOwner,
			to: config.contractAccount,
			value: '0x0',
			data: data
		}

		web3.eth.getTransactionCount('0x' + tokenOwner)
		.then(nonce => {
			rawTx.nonce = web3.utils.toHex(nonce);
		})
		.then(() => {
			var tx = new Tx(rawTx);
			tx.sign(privateKey)

			var serializedTx = tx.serialize();
			web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(error, hash) {
				if (!error) {
					return res.send({'nonce': rawTx.nonce, 'hash': hash})
				} else {
					throw new Error('Transaction error: ' + error);
				}
			});
		})
    })
    .catch((e) => {
	  console.error(e)
      next(new APIError(e.message, httpStatus.INTERNAL_SERVER_ERROR, true));
    });
}

module.exports = { getTotalSupply, getReceiptList, load, sendToken, approval };