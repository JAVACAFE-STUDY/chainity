var User = require('../models/user.model');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.name - The name of user.
 * * @property {string} req.body.email - The email of user.
 * @returns {User}
 */
function create(req, res, next) {

  //TODO create keyStore with password
  var keyStore = {"address":"7cef57fd7faa78c4132e7c748115528e187042a4","crypto":{"cipher":"aes-128-ctr","ciphertext":"4d22f75ebcf79a0d30f4aa470a83fa13d1071fd80ed87c937dba894697963c27","cipherparams":{"iv":"60d4902492dab3a514da5d92e3b16bff"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"847825e6ebcea8e0f9a38d1c06e01470cc74153d8ae7a599cd68466f209d6391"},"mac":"819da9b375c62413c59d6c15804bc5b3fa249a852f968560939f7646e2ca82f1"},"id":"bc933aa4-7772-423b-aa49-368126d673f3","version":3}

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    keyStore: keyStore
  });

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.email - The email of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user;
  user.email = req.body.email;

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove };