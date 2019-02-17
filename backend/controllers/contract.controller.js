var config = require('../config/config');
var User = require('../models/user.model');
var Web3 = require('web3');
var Tx = require('ethereumjs-tx');
var APIError = require('../helpers/APIError');
var httpStatus = require('http-status');

const web3 = new Web3(new Web3.providers.HttpProvider(config.web3Provider));
const erc20 = new web3.eth.Contract(JSON.parse(config.contractABI), config.contractAccount);

var nonces = {};

async function getTotalTokens(req, res) {
	const contract = req.contract;

	contract.methods.totalSupply().call()
	.then(function (balance) {
		return res.send({"tokens" : web3.utils.fromWei(balance)});
	});
}

async function getUserTokens(req, res) {
	const contract = req.contract;
	const tokenOwner = req.user.keyStore.address;

	contract.methods.balanceOf(tokenOwner).call()
	.then(function (balance) {
		return res.send({"tokens" : web3.utils.fromWei(balance)});
	});
}

async function getReceiptList(req, res) {

	var userSet = {};
	await User.list()
    .then(users => {
		for (i in users) {
			if(users[i].keyStore) {
				userSet[web3.utils.toHex(users[i].keyStore.address).toUpperCase()] = users[i];
			}
		}
    })
    .catch(e => console.error);

	const contract = req.contract;

	contract.getPastEvents('Transfer', {
		fromBlock: 0,
		toBlock: 'latest'
	}, function(error, events){
		var eventsArray = []
		for (i in events) {
			var event = {
				'tx' : events[i].transactionHash,
				'block' : events[i].blockHash,
				'from' : events[i].returnValues.from,
				'to' : events[i].returnValues.to,
				'value' : web3.utils.fromWei(events[i].returnValues.value)
			}
			if(userSet[event.from.toUpperCase()]) {
				event['from-ref'] = userSet[event.from.toUpperCase()];
			}
			if(userSet[event.to.toUpperCase()]) {
				event['to-ref'] = userSet[event.to.toUpperCase()];
			}
			eventsArray.push(event)
		}
		return res.send(eventsArray);
	})
}

function load(req, res, next, id) {
	// TODO - for platform
  	// var erc20 = new web3.eth.Contract(JSON.parse(config.contractABI), id);
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
	const contract = req.contract;
	const from = config.systemAddress;
	const to = req.body.receiver;
	const tokens = web3.utils.toWei(req.body.tokens.toString(), 'ether');
	const password = req.body.password;

	User.get(req.decoded._id)
    .then(async (user) => {
		var walletInfo = web3.eth.accounts.decrypt(user.keyStore, password);
		var data = contract.methods.transferFrom(from, to, tokens).encodeABI();
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

function transfer(req, res, next) {
	const contract = req.contract;
	const to = req.body.receiver;
	const tokens = web3.utils.toWei(req.body.tokens.toString(), 'ether');
	const password = req.body.password;

	User.get(req.decoded._id)
    .then(async (user) => {
		var walletInfo = web3.eth.accounts.decrypt(user.keyStore, password);
		var data = contract.methods.transfer(to, tokens).encodeABI();
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
	const contract = req.contract;
	const spender = req.body.spender;
	const tokens = web3.utils.toWei(req.body.tokens.toString(), 'ether');
	const password = req.body.password;

	User.get(req.decoded._id)
    .then(async (user) => {
		var walletInfo = web3.eth.accounts.decrypt(user.keyStore, password);
		var data = contract.methods.approve(spender, tokens).encodeABI();
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

async function getUserTokensAllowance(req, res, next) {
	const contract = req.contract;
	const me = await User.get(req.decoded._id);
	// const tokenOwner = config.systemAddress;
	const tokenOwner = me.keyStore.address;
	const spender = req.user.keyStore.address;
	
	contract.methods.allowance(tokenOwner, spender).call()
	.then(function (tokens) {
		return res.send({"allowance" : web3.utils.fromWei(tokens)});
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

module.exports = { getTotalTokens, getReceiptList, load, sendTokens, approval, getUserTokens, sendCoins, getUserCoins, getUserTokensAllowance, transfer };