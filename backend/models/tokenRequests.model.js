var Promise = require('bluebird');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var config = require('../config/config');

mongoose.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port);

/**
 * TokenRequest Schema
 */
const TokenRequestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  tokens: {
    type: Number,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  registered: {
    type: Date
  },
  status: {
    type: String,
    required: true
  },
  transactionHash: {
    type: String,
  },
  blockNumber: {
    type: Date
  },
  accountId: {
    type: String,
  },
  accountDate: {
    type: Date
  }
});

/**
 * Methods
 */
TokenRequestSchema.method({
});

/**
 * Statics
 */
TokenRequestSchema.statics = {
  /**
   * List TokenRequest in ascending order of 'dueDate'.
   * @param {number} skip - Number of issues to be skipped.
   * @param {number} limit - Limit number of issues to be returned.
   * @returns {Promise<TokenRequest[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ dueDate: 1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  /**
   * List TokenRequest in ascending order of 'dueDate'.
   * @param {number} skip - Number of issues to be skipped.
   * @param {number} limit - Limit number of issues to be returned.
   * @returns {Promise<TokenRequest[]>}
   */
  listMe(id, {skip = 0, limit = 50 } = {}) {
    console.log('test ' + id)
    return this.find({ userId: id})
      .sort({ dueDate: 1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  /**
   * Get TokenRequest
   * @param {ObjectId} id - The objectId of TokenRequest.
   * @returns {Promise<TokenRequest, APIError>}
   */
  get(id) {
    return this.find({ id: parseInt(id) })
      .exec()
      .then((tokenRequest) => {
        if (tokenRequest) {
          return tokenRequest;
        }
        const err = new APIError('No such TokenRequest exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  }
};

/**
 * @typedef TokenRequest
 */
module.exports = mongoose.model('TokenRequest', TokenRequestSchema);
autoIncrement.initialize(mongoose.connection);
/**
 * 1씩 증가하는 primary Key 생성
 * model : 생성할 document 이름
 * field : primary key
 * startAt : 1부터 시작
 */
TokenRequestSchema.plugin(autoIncrement.plugin , { 
  model: 'TokenRequest', 
  field: 'id', 
  startAt: 1,
  incrementBy: 1
});
