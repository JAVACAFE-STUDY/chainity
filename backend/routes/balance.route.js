var express = require('express');
var validate = require('express-validation');
var expressJwt = require('express-jwt');
var paramValidation = require('../config/param-validation');
var config = require('../config/config');
var balanceCtrl = require('../controllers/balance.controller');

const router = express.Router();

router.route('/:id')
  /**
  * @swagger
  * /Balance:
  *   get:
  *     summary: Get Balance
  *     tags: [Balance]
  *     parameters:
  *       - name: user
  *     responses:
  *       200:
  *         description: Balance
  *         schema:
  *           $ref: '#/definitions/Balance'
  */
  .get(balanceCtrl.get)

router.route('/')
  .get(balanceCtrl.getTest)

module.exports = router;