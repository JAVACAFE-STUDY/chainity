var jwt = require('jsonwebtoken');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var User = require('../models/user.model');
var config = require('../config/config');
var Web3 = require('web3');

var web3 = new Web3(config.web3Provider);

/**
 * Returns jwt token if valid email and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {

  User.getByEmail(req.body.email)
    .then((user) => {
      if(user.status == 'invited') {
        throw new APIError('회원 가입 안내 메일을 확인해주세요. 메일 확인이 되지 않을 경우, 스팸으로 분류되었을 수도 있습니다.', httpStatus.UNAUTHORIZED, true);
      }
      if(user.status == 'pending') {
        throw new APIError('시스템 관리자의 승인 후 이용하실 수 있습니다.', httpStatus.UNAUTHORIZED, true);
      }
      var walletInfo = {};
      if(config.root.id === user.email) {
        if(config.root.password === req.body.password) {
          walletInfo.address = user.keyStore.address;
        } else {
          throw new APIError('비밀번호를 다시 확인하세요.', httpStatus.UNAUTHORIZED, true);
        }
      } else {
        try {
          walletInfo = web3.eth.accounts.decrypt(user.keyStore, req.body.password);
        } catch (e) {
          throw new APIError('비밀번호를 다시 확인하세요.', httpStatus.UNAUTHORIZED, true);
        }
      }

      var options = {expiresIn: 60*60*24};
      const token = jwt.sign({
        _id: user._id,
        address: walletInfo.address,
        privateKey: walletInfo.privateKey
      }, config.jwtSecret, options);
      
      return res.json({
        token,
        email: user.email,
        name: user.name
      });
    })
    .catch((e) => {
      next(new APIError(e.message, httpStatus.UNAUTHORIZED, true));
    });
}

/**
 * Create user for registration and append to req.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function loadUserToRegister(req, res, next) {
  var account = web3.eth.accounts.create();
	var encryption = web3.eth.accounts.encrypt(account.privateKey, req.body.password);
  const user = {
    _id: req.body._id,
    name: req.body.name,
    status: 'pending',
    registeredAt: Date.now(),
    keyStore: encryption
  }
  req.user = user;
  return next();
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

module.exports = { login, loadUserToRegister, getRandomNumber };