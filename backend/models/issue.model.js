var Promise = require('bluebird');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var config = require('../config/config');

mongoose.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port);

/**
 * Issue Schema
 */
const IssueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true
  },
  maxNumberOfParticipants: {
    type: Number,
    required: false
  },
  startDate: {
    type: Date,
    required: false
  },
  finishDate: {
    type: Date,
    required: false
  },
  participants: {
    type: Array,
    required: false
  },
  isClosed: {
    type: Boolean,
    required: true
  },
  createdDate: {
    type: Date,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  closedDate: {
    type: Date,
    required: false
  },
  issueType: {
    type: String,
    required: true
  }
});

/**
 * Methods
 */
IssueSchema.method({
});

/**
 * Statics
 */
IssueSchema.statics = {
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
   * @returns {Promise<Issue, APIError>}
   */
  get(id) {
    return this.findOne({ id: parseInt(id) })
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
 * @typedef Issue
 */
module.exports = mongoose.model('Issue', IssueSchema);
autoIncrement.initialize(mongoose.connection);
/**
 * 1씩 증가하는 primary Key 생성
 * model : 생성할 document 이름
 * field : primary key
 * startAt : 1부터 시작
 */
IssueSchema.plugin(autoIncrement.plugin , { 
  model: 'Issue', 
  field: 'id', 
  startAt: 1,
  incrementBy: 1
});
