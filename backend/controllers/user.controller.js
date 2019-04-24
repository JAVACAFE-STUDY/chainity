var multer = require('multer');
var fs= require('fs');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var User = require('../models/user.model');
var config = require('../config/config');
var thumb = require('node-thumbnail').thumb;

/* Create root user */
User.list()
    .then(users => {
      if (users.length < 1) {
        const user = new User({
          email: config.root.id,
          name: config.root.id,
          status: 'active',
          role: config.root.role,
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
      res.json(user);
    })
    .catch(e => next(e));
}

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  if(id === 'me') {
    id = req.decoded._id
  }

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
    .catch((e) => {
      next(new APIError(e.message, httpStatus.BAD_REQUEST));
    });
}

/**
 * Update existing user
 * @property {string} req.body.email - The email of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = new User(req.user);
  if (req.body.name) {
    user.name = req.body.name;
  }
  if (req.body.role) {
    user.role = req.body.role;
  }
  if (req.body.status) {
    user.status = req.body.status;
  }

  User.update({_id: user.id}, user)
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.offset - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
async function list(req, res, next) {
  const { limit = 0, offset = 0, q = {} } = req.query;

  let result = {
    offset: req.query.offset,
    limit: req.query.limit,
    totalDocs: await User.count(),
    docs: await User.list({ limit, offset, q })
  };

  res.json(result)
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
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.imageUploadPath);
  },
  filename: (req, file, cb) => {
    const fileName = req.user._id+'_'+Date.now()+'_profile.jpg';
    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage
}).single('file');

function uploadImage(req, res, next) {
  if(!fs.existsSync(config.imageUploadPath)){
      fs.mkdirSync(config.imageUploadPath);
  }

  upload(req, res, err => {
    if (err) {
      next(new APIError(err.message, httpStatus.BAD_REQUEST));
    } else {
      thumb({
        source: req.file.path,
        destination: config.imageUploadPath,
        // digest: true,
        basename: req.user._id+'_'+Date.now(),
        // suffix: '_thumb',
        width: 50,
        skip: true
      }).then(function(files) {
        const user = new User(req.user);
        user.avatar = req.file.path.replace(config.imageUploadPath,'');
        user.thumbnail = files[0].dstPath.replace(config.imageUploadPath, '');
        User.update({_id: user.id}, user)
          .then(() => res.json({ user }))
          .catch(e => next(e));
      }).catch(function(e) {
        console.error( e.toString());
        next(new APIError(e.toString(), httpStatus.BAD_REQUEST));
      });

    }
  });
}

/**
 * Get system
 * @returns {User}
 */
function getSystem(req, res) {
  User.getSystem()
    .then(user => res.json(user))
    .catch(e => next(e));;
}

module.exports = { load, get, create, update, list, remove, activeList, addressList, uploadImage, getSystem };