var config = require('../config/config');
var User = require('../models/user.model');
var Web3 = require('web3');
var Tx = require('ethereumjs-tx');
var APIError = require('../helpers/APIError');
var httpStatus = require('http-status');
var web3 = new Web3(new Web3.providers.HttpProvider(config.web3Provider));

var nonces = {};

function getTotalTokens(req, res) {
	req.contract.methods.decimals().call()
	.then(decimals => {
		req.contract.methods.totalSupply().call()
		.then(function (balance) {
			if(balance > 0) {
				balance = balance / Math.pow(10, decimals)
			}
			return res.send({"tokens" : balance});
    	});
	})
}

function getUserTokens(req, res) {
	req.contract.methods.decimals().call()
	.then(decimals => {
		req.contract.methods.balanceOf(req.user.keyStore.address).call()
		.then(function (balance) {
			if(balance > 0) {
				balance = balance / Math.pow(10, decimals)
			}
			return res.send({"tokens" : balance});
    	});
	})
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

async function _sendTx(walletInfo, to, data, value) {
	var myAddress = walletInfo.address;
	var privateKey = new Buffer(walletInfo.privateKey.replace('0x', ''), 'hex')
	var result = {
		nonceFromNode : '',
		nonceFromMemory : '',
		txHash : ''
	};
	let nonce = await web3.eth.getTransactionCount(myAddress);
	result.nonceFromNode = nonce;

	var rawTx = {
		nonce : web3.utils.toHex(getUpdatedNonce(myAddress, nonce)),
		gasPrice: web3.utils.toHex(config.gasPrice),
		gasLimit: web3.utils.toHex(config.gasLimit),
		to: web3.utils.toHex(to),
		value: web3.utils.toHex(value),
		data: data
	}
	result.nonceFromMemory = rawTx.nonce;

	var tx = new Tx(rawTx);
	tx.sign(privateKey);

	await web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function(error, hash) {
		if (!error) {
			result.txHash = hash;
		} else {
			throw new APIError('Transaction error: ' + error);
		}
	});

	return result;
}

function sendTokens(req, res, next) {
	const from = config.systemAddress;
	const to = req.body.receiver;
	const tokens = req.body.tokens;
	const password = req.body.password;

	User.get(req.decoded._id)
    .then(async (user) => {
		var walletInfo = web3.eth.accounts.decrypt(user.keyStore, password);
		var data = req.contract.methods.transferFrom(from, to, tokens).encodeABI();
		try{
			res.send(await _sendTx(walletInfo, config.contractAccount, data, 0));
		} catch (e) {
			throw e;
		}
    })
    .catch((e) => {
      next(new APIError(e.message, httpStatus.INTERNAL_SERVER_ERROR, true));
    });
}

function approval(req, res, next) {
	const spender = req.body.spender;
	const tokens = req.body.tokens;
	const password = req.body.password;

	User.get(req.decoded._id)
    .then(async (user) => {
		var walletInfo = web3.eth.accounts.decrypt(user.keyStore, password);
		var data = req.contract.methods.approve(spender, tokens).encodeABI();
		try{
			res.send(await _sendTx(walletInfo, config.contractAccount, data, 0));
		} catch (e) {
			throw e;
		}
    })
    .catch((e) => {
      next(new APIError(e.message, httpStatus.INTERNAL_SERVER_ERROR, true));
	});
}

function getUserCoins(req, res, next) {
	web3.eth.getBalance(req.user.keyStore.address, function(err, result) {
		return res.send({"coins" : result});
	});
}

function sendCoins(req, res, next) {
	const to = req.user.keyStore.address;
	const coins = web3.utils.toWei(req.body.coins.toString(), 'ether');
	const password = req.body.password;

	User.get(req.decoded._id)
    .then(async (user) => {
		var walletInfo = web3.eth.accounts.decrypt(user.keyStore, password);
		try {
			res.send(await _sendTx(walletInfo, to, '0x00', coins));
		} catch (e) {
			throw e;
		}
	})
	.catch((e) => {
		next(new APIError(e.message, httpStatus.INTERNAL_SERVER_ERROR, true));
	});
}

function getUpdatedNonce(address, systemNonce) {
	if(nonces[address]) {
		nonces[address] = (nonces[address] < systemNonce) ? systemNonce : nonces[address]+1;
	} else {
		nonces[address] = systemNonce;
	}
	return nonces[address];
}

module.exports = { getTotalTokens, getReceiptList, load, sendTokens, approval, getUserTokens, sendCoins, getUserCoins };