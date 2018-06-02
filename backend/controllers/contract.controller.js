var config = require('../config/config');
var Web3 = require('web3');
var User = require('../models/user.model');

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
		filter: {to: req.decoded.address},
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

function approval(req, res) {
	var nonce = web3.eth.getTransactionCount('0x' + req.body.user.keyStore.address)
    nonce.then(resultNonce => {
    	var Tx = require('ethereumjs-tx');
    	console.log('nonce : ' + nonce)
    	var walletInfo = web3.eth.accounts.decrypt(req.body.user.keyStore, req.body.password);
		var privateKey = new Buffer(walletInfo.privateKey.replace('0x', ''), 'hex')

		var data = req.contract.methods.approve(req.body.receiver, req.body.tokens).encodeABI();

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
				return res.send({"result" : "success", "hash" : hash})
			} else {
				return res.send({"result" : "error", "errorMessage" : error})
			}
		});
    })
}

module.exports = { getTotalSupply, getReceiptList, load, sendToken, approval };