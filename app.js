require('dotenv').config();

var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var Web3 = require("web3");
var Web3EthAccounts = require('web3-eth-accounts');
var fs = require('fs');
var async = require('async');

server.listen(8080);

app.use(express.static("public"));

app.get("/", function(req, res){
	res.sendFile(__dirname + "/public/html/index.html");
});

app.get("/balance", function(req, res){
	res.sendFile(__dirname + "/public/html/balance.html");
});

app.get("/transactions", function(req, res){
	res.sendFile(__dirname + "/public/html/transactions.html");
});

app.get("/transfer", function(req, res){
	res.sendFile(__dirname + "/public/html/transfer.html");
});

app.get("/transfer_from", function(req, res){
	res.sendFile(__dirname + "/public/html/transfer_from.html");
})

app.get("/approve", function(req, res){
	res.sendFile(__dirname + "/public/html/approve.html");
});

app.get("/create_account", function(req, res){
  res.sendFile(__dirname + "/public/html/create_account.html");
});

app.get("/accounts", function(req, res){
  res.sendFile(__dirname + "/public/html/accounts.html");
});

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var erc20Contract = web3.eth.contract([{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string","value":"javacafe"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256","value":"1e+22"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8","value":"18"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256","value":"0"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string","value":"jc"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256","value":"0"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}]);
var erc20 = erc20Contract.at(process.env.CONTRACT_ACCOUNT);

app.get("/getBalancOf", function(req, res){
  var balance = erc20.balanceOf(req.query.address);
  res.send(balance.toFormat(0));
});

app.get("/sendTransaction", function(req, res) {
	res.send(erc20.transfer(req.query.to, req.query.value, {from: req.query.from, gas: 250000}));
});

app.get("/sendTransferFrom", function(req, res) {
	res.send(erc20.transferFrom(req.query.from, req.query.to, req.query.value, {from: req.query.my, gas: 250000}));
})

app.get("/sendApprove", function(req, res) {
    res.send(erc20.approve(req.query.spender, req.query.value, {from: req.query.from, gas: 250000}));
})

app.get("/getTransactions", function(req, res){
	var events = erc20.allEvents({fromBlock: process.env.BLOCK_BEGIN_NUMBER, toBlock: 'latest'});
	events.get(function(error, logs){
		res.send(logs);
	});
});

var accounts = new Web3EthAccounts('ws://localhost:8546');

app.get('/createAccount', function (req, res) {
	// 계정 생성
	var account = accounts.create();
	// 비공개 키를 web3 keystore v3 표준으로 암호화
	var private_key = JSON.parse(JSON.stringify(account)).privateKey;
	var password = 'Test!';
	var enc = accounts.encrypt(private_key, password);
	// 암호화된 JSON 데이터를 파일에 저장
	var date = new Date().toISOString().replace(/:/g, '-');
	var address = JSON.parse(JSON.stringify(enc)).address;
    var file_name = "./keystore/UTC--" + date + "--" + address
	fs.writeFile(file_name, JSON.stringify(enc), function(err) {
		if(err) {
	    	res.status(500).json({ error: err.message });
			return;
		}
		res.send("success");
	});
});

app.get('/getAccounts', function (req, res) {
	var array = new Array();
	var dirPath = "./keystore/";

	fs.readdir(dirPath, function (err, filesPath) {
	    if (err) {
	    	res.status(500).json({ error: err.message });
	    	return;
	    }
	    filesPath = filesPath.map(function(filePath) {
	        return dirPath + filePath;
	    });
	    async.map(filesPath, function(filePath, cb) {
	        fs.readFile(filePath, 'utf8', cb);
	    }, function(err, contentList) {
	    	contentList.forEach( function(element, index) {
	    		// keystore v3 JSON을 암호 해독
	    		var decypt = accounts.decrypt(element, 'Test!');
	    		// console.log(decypt);
	    		array.push({ address: decypt.address, privateKey: decypt.privateKey});
	    	});
	    	// console.log(JSON.stringify(array));
	    	res.send(JSON.stringify(array));
	    });
	});
});
