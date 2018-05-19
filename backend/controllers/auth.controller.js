var jwt = require('jsonwebtoken');
var httpStatus = require('http-status');
var Web3 = require('web3');
var APIError = require('../helpers/APIError');
var config = require('../config/config');

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
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
  if (req.body.email === user.email && req.body.password === user.password) {
    const token = jwt.sign({
      email: user.email
    }, config.jwtSecret);
    return res.json({
      token,
      email: user.email
    });
  }

  const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
  return next(err);
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