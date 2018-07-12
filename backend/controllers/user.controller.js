var multer = require('multer');
var fs= require('fs');

var User = require('../models/user.model');
var config = require('../config/config');

User.list()
    .then(users => {
      if (users.length < 1) {
        const user = new User({
          email: config.root.id,
          name: config.root.id,
          status: 'active',
          role: 'admin',
          keyStore: JSON.parse(config.root.keyStore)
        });
        
        user.save()
          .then(savedUser => console.info(savedUser))
          .catch(e => console.error);
      }
    })
    .catch(e => console.error);

function activeList(req, res) {
  User.find({status: 'active'}).select({ "email": 2, "name": 1, "_id": 0})
    .then(user => res.json(user))
    .catch(e => next(e));;
}

function addressList(req, res) {
  var array = req.query.selected.split(',');
  User.find({ email: array })
    .then(user => {
      // console.log(user);
      res.json(user);
    })
    .catch(e => next(e));
}

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
 * @property {string} req.body.email - The email of user.
 * @returns {User}
 */
function create(req, res, next) {
  const user = new User({
    email: req.body.email,
    role: req.body.role,
    status: req.body.status
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
  const user = new User(req.user);
  user.name = req.body.name

  User.update({_id: user.id}, user)
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

/**
 * Get user token.
 * @returns {token}
 */
function getToken(req, res, next) {
  const token = User.getToken(req.user.keyStore.address)
  token.call().then(function(token) {
    res.json({"token" : Number(token) })
  });
}

/**
 * Get my token.
 * @returns {token}
 */
function getMyToken(req, res, next) {
  const token = User.getToken(req.decoded.address)
  token.call().then(function(token) {
    res.json({"token" : Number(token) })
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/');
  },
  filename: (req, file, cb) => {
    const fileName = "profile_" + file.originalname + ".jpg";
    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage
}).single('profile');

function uploadImage(req, res, next) {
  upload(req, res, err => {
    if (err) {
      res.json({"result" : "Fail" })
    } else {
      res.json({"result" : "Success" })
    }
  });
}

function profileImage(req, res, next) {
  fs.readFile("upload/profile_" + req.params.id + ".jpg", function(error,data){
    if (error) {
      res.writeHead(404, {"Content": "image/jpeg"})
      res.end()
    } else {
      res.writeHead(200, {"Content": "image/jpeg"})
      res.end(data)
    }
  })
}

module.exports = { load, get, create, update, list, remove, getToken, getMyToken, activeList, addressList, uploadImage, profileImage };
