var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
    console.log(req.body)
    var id = parseInt(req.body.id, 10)
    var name = req.body.name
    var balance = req.body.balance

    res.send(id + ", " + name + ", " + balance)
});

module.exports = router;