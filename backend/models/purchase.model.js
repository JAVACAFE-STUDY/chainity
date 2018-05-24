var Promise = require('bluebird');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var config = require('../config/config');

mongoose.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port);

/**
 * Purchase Schema
 */
const PurchaseSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  registered: {
    type: Date
  },
  status: {
    type: String,
    required: true
  }
});

/**
 * Methods
 */
PurchaseSchema.method({
});

/**
 * Statics
 */
PurchaseSchema.statics = {
  /**
   * List issues in ascending order of 'dueDate'.
   * @param {number} skip - Number of issues to be skipped.
   * @param {number} limit - Limit number of issues to be returned.
   * @returns {Promise<Issue[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ dueDate: 1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  /**
   * Get issue
   * @param {ObjectId} id - The objectId of issue.
   * @returns {Promise<Purchase, APIError>}
   */
  get(id) {
    return this.find({ id: parseInt(id) })
      .exec()
      .then((issue) => {
        if (issue) {
          return issue;
        }
        const err = new APIError('No such issue exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  }
};

/**
 * @typedef Purchase
 */
module.exports = mongoose.model('Purchase', PurchaseSchema);
autoIncrement.initialize(mongoose.connection);
/**
 * 1씩 증가하는 primary Key 생성
 * model : 생성할 document 이름
 * field : primary key
 * startAt : 1부터 시작
 */
PurchaseSchema.plugin(autoIncrement.plugin , { 
  model: 'Purchase', 
  field: 'id', 
  startAt: 1,
  incrementBy: 1
});
