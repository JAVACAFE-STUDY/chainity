require('dotenv').config();

var bodyParser = require("body-parser");
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var Web3 = require("web3");
var Web3EthAccounts = require('web3-eth-accounts');
var fs = require('fs');
var async = require('async');
var abi = require('./contracts/ABI.json');

server.listen(8080);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Render HTML file
app.get("/", function(req, res){res.sendFile(__dirname + "/public/html/index.html");});
app.get("/accounts", function(req, res){res.sendFile(__dirname + "/public/html/accounts.html");});
app.get("/create_account", function(req, res){res.sendFile(__dirname + "/public/html/create_account.html");});
app.get("/balance", function(req, res){res.sendFile(__dirname + "/public/html/balance.html");});
app.get("/transactions", function(req, res){res.sendFile(__dirname + "/public/html/transactions.html");});
app.get("/transfer", function(req, res){res.sendFile(__dirname + "/public/html/transfer.html");});
app.get("/transfer_from", function(req, res){res.sendFile(__dirname + "/public/html/transfer_from.html");})
app.get("/approve", function(req, res){res.sendFile(__dirname + "/public/html/approve.html");});

// Create an instance of web3 using the HTTP provider.
var web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER));

// Create contract object
var erc20Contract = web3.eth.contract(abi);

// Initiate contract for an address
var erc20 = erc20Contract.at(process.env.CONTRACT_ACCOUNT);

app.get('/api/getAccounts', function (req, res) {
	res.send(web3.eth.accounts);
})

app.get('/api/getCoinbase', function (req, res) {
	res.send(web3.eth.coinbase);
})

var accounts = new Web3EthAccounts('ws://localhost:8546');

app.post('/api/getAccounts', function (req, res) {
	var password = req.body.password;
	var dir = req.body.dir.endsWith('/') ? req.body.dir : req.body.dir + '/';

	var array = new Array();
	fs.readdir(dir, function (err, filesPath) {
	    if (err) {
	    	res.status(500).json({ error: err.message });
	    	return;
	    }
	    filesPath = filesPath.map(function(filePath) {
	        return dir + filePath;
	    });
	    async.map(filesPath, function(filePath, cb) {
	        fs.readFile(filePath, 'utf8', cb);
	    }, function(err, contentList) {
	    	contentList.forEach( function(element, index) {
	    		// keystore v3 JSON을 암호 해독
	    		var decypt = accounts.decrypt(element, password);
	    		array.push({ address: decypt.address, privateKey: decypt.privateKey});
			});
	    	// console.log(JSON.stringify(array));
	    	res.send(JSON.stringify(array));
	    });
	});
});

app.post('/api/getPrivateKey', function (req, res) {
	var publicKey = req.body.publicKey;
	var password = req.body.password;
	var dir = req.body.dir.endsWith('/') ? req.body.dir : req.body.dir + '/';

	var array = new Array();
	fs.readdir(dir, function (err, filesPath) {
	    if (err) {
	    	res.status(500).json({ error: err.message });
	    	return;
	    }
	    filesPath = filesPath.map(function(filePath) {
	        return dir + filePath;
	    });
	    async.map(filesPath, function(filePath, cb) {
			if(filesPath.endsWith(publicKey)) {
				fs.readFile(filePath, 'utf8', cb);
			}
	    }, function(err, contentList) {
			var privateKey;
	    	contentList.forEach( function(element, index) {
	    		// keystore v3 JSON을 암호 해독
	    		var decypt = accounts.decrypt(element, password);
				array.push({ address: decypt.address, privateKey: decypt.privateKey});
				privateKey = decypt.privateKey;
			});
	    	// console.log(JSON.stringify(array));
	    	res.send({'priavteKey' : privateKey});
	    });
	});
});

app.post('/api/createAccount', function (req, res) {
	var dir = req.body.dir.endsWith('/') ? req.body.dir : req.body.dir + '/';
	var password = req.body.password;

	// 계정 생성
	var account = accounts.create();
	// 비공개 키를 web3 keystore v3 표준으로 암호화
	var private_key = JSON.parse(JSON.stringify(account)).privateKey;
	
	var enc = accounts.encrypt(private_key, password);
	// 암호화된 JSON 데이터를 파일에 저장
	var date = new Date().toISOString().replace(/:/g, '-');
	var address = JSON.parse(JSON.stringify(enc)).address;
    var file_name = "UTC--" + date + "--" + address
	fs.writeFile(dir + file_name, JSON.stringify(enc), function(err) {
		if(err) {
	    	res.status(500).json({ error: err.message });
			return;
		}
		res.send(enc);
	});
});

app.get("/api/getBalancOf", function(req, res){
  var balance = erc20.balanceOf(req.query.address);
  res.send(balance.toFormat(0));
});

// error without setting 'from'
app.get("/api/transfer", function(req, res) {
	res.send(erc20.transfer(req.query.to, req.query.value, {from: req.query.from, gas: 250000}));
});

// error without setting 'from'
app.get("/api/approve", function(req, res) {
	res.send(erc20.approve(req.query.spender, req.query.value, {from: req.query.from, gas: 250000}));
})

// error without setting 'from'
app.get("/api/transferFrom", function(req, res) {
	res.send(erc20.transferFrom(req.query.from, req.query.to, req.query.value, {from: req.query.my, gas: 250000}));
})

app.get("/getTransactions", function(req, res){
	var events = erc20.allEvents({fromBlock: process.env.BLOCK_BEGIN_NUMBER, toBlock: 'latest'});
	events.get(function(error, logs){
		res.send(logs);
	});
});
