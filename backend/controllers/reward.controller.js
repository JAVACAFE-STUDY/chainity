var config = require('../config/config');
var Reward = require('../models/reward.model');
var User = require('../models/user.model');
var Nonce = require('../helpers/Nonce');
var Web3 = require('web3');
var Tx = require('ethereumjs-tx');

const web3 = new Web3(new Web3.providers.HttpProvider(config.web3Provider));
const erc20 = new web3.eth.Contract(JSON.parse(config.contractABI), config.contractAccount);

/**
 * Get rewards list.
 * @property {number} req.query.offset - Number of issues to be skipped.
 * @property {number} req.query.limit - Limit number of issues to be returned.
 * @returns {Issue[]}
 */
async function list(req, res, next) {
  const { limit = 0, offset = 0, q = {} } = req.query;

  let docs = [];
  if(limit > 0) {
    docs = await Reward.list({ limit, offset, q });
  }

  const result = {
    offset: offset,
    limit: limit,
    totalDocs: await Reward.count(q),
    docs: docs
  };

  res.json(result)
}

/**
 * Load reward and append to req.
 */
function load(req, res, next, id) {
  Reward.get(id)
    .then((reward) => {
      req.reward = reward; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Create new reward
 * @property {string} req.body.event
 * @property {string} req.body.rewardedUser
 * @property {string} req.body.tokens
 * @returns {Reward}
 */
function create(req, res, next) {
  const reward = new Reward({
    event: req.body.event,
    rewardedUser: req.body.rewardedUser,
    createdBy: req.decoded._id,
    tokens: req.body.tokens,
    createdAt: Date.now()
  });

  reward.save()
    .then(savedReward=> {
      res.json(savedReward) 
      return savedReward;
    })
    .then(async savedReward => {
      const from = config.systemAddress;
      const rewardedUser = await User.get(savedReward.rewardedUser);
      const to = rewardedUser.keyStore.address;
      const tokens = savedReward.tokens;
      const data = erc20.methods.transferFrom(from, to, tokens).encodeABI();

      const sender = req.decoded.address;
      const privateKey = req.decoded.privateKey;

      const nonce = await web3.eth.getTransactionCount(sender);
      var rawTx = {
        nonce : web3.utils.toHex(Nonce.getFreshNonce(sender, nonce)),
        gasPrice: web3.utils.toHex(config.gasPrice),
        gasLimit: web3.utils.toHex(config.gasLimit),
        to: web3.utils.toHex(to),
        value: web3.utils.toHex(0),
        data: data
      }
      
      const tx = new Tx(rawTx);
      tx.sign(new Buffer(privateKey.replace('0x', ''), 'hex'));
    
      web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), (error, tx) => {
        savedReward.tx = tx;
        savedReward.save();
      }).on('error', console.error);
    })
    .catch(e => next(e));
}

module.exports = { list, create };
