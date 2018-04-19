require('dotenv').config();

var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var Web3 = require("web3");
var Web3EthAccounts = require('web3-eth-accounts');

server.listen(8080);

app.use(express.static("public"));

app.get("/", function(req, res){
	res.sendFile(__dirname + "/public/html/index.html");
})

app.get("/balance", function(req, res){
	res.sendFile(__dirname + "/public/html/balance.html");
})

app.get("/transactions", function(req, res){
	res.sendFile(__dirname + "/public/html/transactions.html");
})

app.get("/transaction", function(req, res){
	res.sendFile(__dirname + "/public/html/transaction.html");
})

app.get("/approve", function(req, res){
	res.sendFile(__dirname + "/public/html/approve.html");
})

app.get("/create_account", function(req, res){
  res.sendFile(__dirname + "/public/html/create_account.html");
})


var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var erc20Contract = web3.eth.contract([{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string","value":"javacafe"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256","value":"1e+22"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8","value":"18"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256","value":"0"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string","value":"jc"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256","value":"0"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}]);
var erc20 = erc20Contract.at(process.env.CONTRACT_ACCOUNT);

app.get("/getBalancOf", function(req, res){
  var balance = erc20.balanceOf(req.query.address);
  res.send(balance.toFormat(0));
})

app.get("/sendTransaction", function(req, res) {
  res.send(erc20.transferFrom({from: req.query.from, to:req.query.to, value:req.query.value}));
})

app.get("/sendApprove", function(req, res) {
  res.send(erc20.approve({spender: req.query.spender, value:req.query.value}));
})

app.get("/getTransactions", function(req, res){
	var filter = web3.eth.filter({
		fromBlock: process.env.BLOCK_BEGIN_NUMBER,
		address: process.env.CONTRACT_ACCOUNT
	});

	filter.get(function(error, logs){
		var results = [];
		for (var idx in logs) {
			var result = {};
			var log = logs[idx];
			result.from = log.topics[1].replace('0x000000000000000000000000', '');
			result.to = log.topics[2].replace('0x000000000000000000000000', '');
			result.token = web3.toBigNumber(log.data).toNumber();
			results.push(result);
		}
		res.send(results);
	});
})

var account = new Web3EthAccounts('ws://localhost:8546');


app.get('/create', function (req, res) {
	console.log(account.create());
});
