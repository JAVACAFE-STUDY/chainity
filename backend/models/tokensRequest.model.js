var Promise = require('bluebird');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var config = require('../config/config');

mongoose.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port);

/**
 * TokensRequest Schema
 */
const TokensRequestSchema = new mongoose.Schema({
  createdDate: {
    type: Date,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  receiverBank: {
    type: String,
    required: true
  },
  receiverName: {
    type: String,
    required: true
  },
  receiverAccount: {
    type: String,
    required: true
  },
  tx: {
    type: String,
  },
  approvedDate: {
    type: Date
  }
});

/**
 * Methods
 */
TokensRequestSchema.method({
});

/**
 * Statics
 */
TokensRequestSchema.statics = {
  /**
   * List TokensRequest in ascending order of 'dueDate'.
   * @param {number} skip - Number of issues to be skipped.
   * @param {number} limit - Limit number of issues to be returned.
   * @returns {Promise<TokensRequest[]>}
   */
  list({ skip = 0, limit = 50} = {}) {
    return this.find()
      .sort({ dueDate: 1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  /**
   * List TokensRequest in ascending order of 'dueDate'.
   * @param {number} skip - Number of issues to be skipped.
   * @param {number} limit - Limit number of issues to be returned.
   * @returns {Promise<TokensRequest[]>}
   */
  listByCreatedBy(createdBy, {skip = 0, limit = 50 } = {}) {
    return this.find({ createdBy: createdBy})
      .sort({ createdDate: 1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  /**
   * Get TokensRequest
   * @param {ObjectId} id - The objectId of TokensRequest.
   * @returns {Promise<TokensRequest, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((TokensRequest) => {
        if (TokensRequest) {
          return TokensRequest;
        }
        const err = new APIError('No such TokensRequest exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  }
};

/**
 * @typedef TokensRequest
 */
module.exports = mongoose.model('TokensRequest', TokensRequestSchema);
