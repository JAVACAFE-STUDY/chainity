var Promise = require('bluebird');
var mongoose = require('mongoose');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var config = require('../config/config');
var ObjectID = require('mongodb').ObjectID

mongoose.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port);

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique : true
  },
  name: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  registeredAt: {
    type: Date
  },
  keyStore: {
    type: JSON
  },
  avatar: {
    type: String
  },
  thumbnail: {
    type: String
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true 
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.method({
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * Get system
   * @returns {Promise<User, APIError>}
   */
  getSystem() {
    return this.findOne({'role' : 'system'})
      .exec()
      .then((user) => {
        if (user) {
          console.log("model getSystem: " + user);
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * Get user by email
   * @param {ObjectId} email - The email of user.
   * @returns {Promise<User, APIError>}
   */
  getByEmail(email) {
    return this.findOne({'email' : email})
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50, q = {} } = {}) {
    return this.find(q)
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  findAll(userIds) {
    var ids = userIds.map(function(id) { 
      return ObjectID(id); 
    });
    return this.find({ _id: {$in: ids}})
      .exec()
      .then((users) => {
        if(users) {
          return users;
        }
        const err = new APIError('No such users exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  aggsList(startDate, endDate) {
    var aggr = [];
    aggr.push(
    {
      $lookup: {
        from: 'participations', 
        localField: '_id', 
        foreignField: 'participant', 
        as: 'countOfPartipations' 
      }
    },
    { 
      $lookup: {
        from: 'rewards', 
        localField: '_id', 
        foreignField: 'rewardedUser', 
        as: 'tokens'
      }
    },
    { 
      $project: { 
        _id: 1,
        email: 1,
        name: 1,
        status: 1,
        role: 1,
        createdAt: 1,
        registeredAt: 1,
        avatar: 1,
        thumbnail: 1,
        keyStore: 1,
        tokens: 1,
        countOfPartipations: {
          $filter: {
            input: "$countOfPartipations",
            as: "countOfPartipation",
            cond: { $and: [
              { $gte: [ "$$countOfPartipation.createdAt", new Date(startDate) ] },
              { $lte: [ "$$countOfPartipation.createdAt", new Date(endDate) ] }
            ] }
          }
        }
      }
    }
    )
    return this.aggregate(aggr)
    .exec();
  }
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema);