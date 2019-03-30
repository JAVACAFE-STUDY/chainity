var Promise = require('bluebird');
var mongoose = require('mongoose');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var config = require('../config/config');
var ObjectID = require('mongodb').ObjectID

mongoose.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port);

/**
 * Reward Schema
 */
const RewardSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issues',
    required: true
  },
  rewardedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tokens: {
    type: Number,
    required: false
  },
  tx: {
    type: String,
    required: true,
    unique : true
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
RewardSchema.method({
});

/**
 * Statics
 */
RewardSchema.statics = {
  /**
   * Get total reward tokens
   * @param {ObjectId} id - The objectId of issue.
   * @returns {Promise<Issue, APIError>}
   */
  getTotalRewardTokens() {
    return this.aggregate(
      [
        { $group: { _id: null, totalTokens: { $sum: "$tokens" } } }
      ]
    )
    .exec();
  }
};

/**
 * @typedef Reward
 */
module.exports = mongoose.model('Reward', RewardSchema);