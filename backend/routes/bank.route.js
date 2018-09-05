var express = require('express');
var config = require('../config/config');
var bankCtrl = require('../controllers/bank.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/:id/transfers')
  /** GET /api/banks/nh/transfers - Get trasfer histories */
  .get(bankCtrl.getTansfers)

  /** POST /api/banks/nh/transfers - Get trasfer histories */
  .post(bankCtrl.drawTransfer);

/** Load bank when API with bank name route parameter is hit */
router.param('id', function(req, res, next, id){
  if('nh' == id) {
    req.api = config.bank.nh.api;
    next();
  } else {
    console.error(id + 'is not supporeted.');
  }
});

module.exports = router;