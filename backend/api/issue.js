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

module.exports = router;