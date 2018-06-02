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

function getTest(req, res) {
    var nonce = web3.eth.getTransactionCount("0xA5C4B67A464AA5A511f0C8B360b2e8Ad83a49A06")
    nonce.then(resultNonce => {
    	var Tx = require('ethereumjs-tx');
		var privateKey = new Buffer('d790bc5a1f0adf09629eaabd2986e431fa795324dbca3191236309aefc03ada0','hex')
		var data = erc20.methods.transfer("0x7cef57fd7faa78c4132e7c748115528e187042a4", "100").encodeABI();

		var rawTx = {
		  nonce: web3.utils.toHex(resultNonce),
		  gasPrice: web3.utils.toHex(2550000),
		  gasLimit: web3.utils.toHex(3050000),
		  from: "0xA5C4B67A464AA5A511f0C8B360b2e8Ad83a49A06",
		  to: config.contractAccount,
		  value: '0x0',
		  data: data
		}

		var tx = new Tx(rawTx);
		tx.sign(privateKey);

		var serializedTx = tx.serialize();

		web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
		  if (!err) {
				console.log("success : " + hash);
				return res.send(hash)
			} else {
				console.log("zzz : " + err);
				return res.send(err)
			}
		});
    })
}

function numberWithCommas (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

module.exports = { get, getTest };