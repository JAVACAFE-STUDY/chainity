var express = require('express');
var router = express.Router();
var users = require('../models/users.json');

router.get('/', function (req, res, next) {
    res.send(users)
});

router.get('/:id', function (req, res, next) {
  var id = parseInt(req.params.id, 10)
  var user = users.filter(function (user) {
    return user.id === id
  });
  res.send(user)
});

router.post('/', function (req, res, next) {
    var id = parseInt(req.body.id, 10)
    var name = req.body.name
    var balance = req.body.balance

    res.send(id + ", " + name + ", " + balance)
});

router.put('/:id', function (req, res, next) {
  res.send("Success")
});


module.exports = router;
