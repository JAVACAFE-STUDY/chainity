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
  tokens: {
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
  participants: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }],
  isClosed: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  closedAt: {
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
   * @param {number} skip - Number of issues to be skipped.
   * @param {number} limit - Limit number of issues to be returned.
   * @returns {Promise<Issue[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
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
      .populate('participants')
      .populate('createdBy')
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
