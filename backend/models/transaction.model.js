var Promise = require('bluebird');
var mongoose = require('mongoose');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var config = require('../config/config');
var ObjectID = require('mongodb').ObjectID

/**
 * User Schema
 */
const TransactionsSchema = new mongoose.Schema({
  txHash: {
    type: String,
    required: true,
    unique : true
  },
  toAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fromAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tokenValue: {
    type: Number,
    required: true
  },
  txType: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  registeredAt: {
    type: Date
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
TransactionsSchema.method({
});

/**
 * Statics
 */
TransactionsSchema.statics = {
  /**
   * Get transactions
   * @param {ObjectId} id - The objectId of transaction.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findOne({ id: parseInt(id) })
      .populate('toAddress')
      .populate('fromAddress')
      .exec()
      .then((transaction) => {
        if (transaction) {
          return transaction;
        }
        const err = new APIError('No such Transaction exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List transactions in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of transactions to be skipped.
   * @param {number} limit - Limit number of transactions to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50, q = {} } = {}) {
    return this.find(q)
      .populate('toAddress')
      .populate('fromAddress')
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef Transactions
 */
module.exports = mongoose.model('Transaction', TransactionsSchema);