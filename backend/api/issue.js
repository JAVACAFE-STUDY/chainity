var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbconfig   = require('../config/database.js');
var connection = mysql.createConnection(dbconfig);

router.get('/detail/:no', function (req, res, next) {
	var no = parseInt(req.params.no, 0)
	var sql = 'SELECT no, title, content, count, rewards, DATE_FORMAT(due_date, "%Y-%m-%d") due_date FROM issues WHERE no = ?';
	connection.query(sql, [no], function (err, result) {
		if(err) throw err;

		res.send(result);
	});
});

router.get('/list', function(req, res, next) {
	var sql = 'SELECT no, title, content, count, rewards, DATE_FORMAT(due_date, "%Y-%m-%d") due_date FROM issues';
	connection.query(sql, function(err, result) {
		if(err) throw err;

		res.send(result);
	});
});

router.post('/add', function(req, res, next) {
	var sql = 'INSERT INTO issues (title, content, count, rewards, writer, due_date) VALUES ?';
	var values = [[
					req.body.title, 
					req.body.content,
					req.body.count,
					req.body.rewards,
					1,
					req.body.due_date
				]];
	
	connection.query(sql, [values], function(err, result) {
		if(err) throw err;

		res.send(result);
	});
});

module.exports = router;