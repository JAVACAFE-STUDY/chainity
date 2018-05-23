var jwt = require('jsonwebtoken');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var User = require('../models/user.model');
var config = require('../config/config');
var Web3 = require('web3');

var web3 = new Web3(config.web3Provider);

// sample user, used for authentication
const user = {
  email: 'system',
  password: 'system'
};

/**
 * Returns jwt token if valid email and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  if (req.body.email === user.email && req.body.password === user.password) {
    var options = {expiresIn: 60*60*24};
    const token = jwt.sign({
      email: user.email
    }, config.jwtSecret, options);
    return res.json({
      token,
      name: user.email
    });
  }

  User.getByEmail(req.body.email)
    .then((user) => {
      var walletInfo = web3.eth.accounts.decrypt(user.keyStore, req.body.password);

      var options = {expiresIn: 60*60*24};
      const token = jwt.sign({
        email: req.body.email,
        address: walletInfo.address
      }, config.jwtSecret, options);
      
      return res.json({
        token,
        address: walletInfo.address,
        username: user.name
      });
    })
    .catch((e) => {
      next(new APIError(e.message, httpStatus.UNAUTHORIZED, true));
    });
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

module.exports = { login, getRandomNumber };