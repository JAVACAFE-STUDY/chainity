var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

server.listen(8080);

app.use(express.static("public"));

app.get("/", function(req, res){
	res.sendFile(__dirname + "/public/html/index.html");
})

app.get("/balance", function(req, res){
	res.sendFile(__dirname + "/public/html/balance.html");
})

app.get("/transaction", function(req, res){
	res.sendFile(__dirname + "/public/html/transaction.html");
})

app.get("/approve", function(req, res){
	res.sendFile(__dirname + "/public/html/approve.html");
})

var Web3 = require("web3");

web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var erc20Contract = web3.eth.contract([{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string","value":"javacafe"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256","value":"1e+22"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8","value":"18"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256","value":"0"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string","value":"jc"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256","value":"0"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}]);
var erc20 = erc20Contract.at("0x9bf53B7c67b3a43E6982243Befc81aDe27B7443F");

app.get("/getInfo", function(req, res){

  var account0_balance = erc20.balanceOf("0x7CEF57FD7FAa78c4132e7c748115528e187042a4");
  var account1_balance = erc20.balanceOf("0x1f6AFf903757d338AE80F1E8fE66b8668D816d4C");
  var account2_balance = erc20.balanceOf("0xE125665F3aDb9BA3013E218057C891dd2d79Ee8a");
  var account3_balance = erc20.balanceOf("0xA5C4B67A464AA5A511f0C8B360b2e8Ad83a49A06");

  var accounts = {};
  accounts.account0 = account0_balance;
  accounts.account1 = account1_balance;
  accounts.account2 = account2_balance;
  accounts.account3 = account3_balance;

  res.send(accounts);
})

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
