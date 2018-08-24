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
  title: { // 이슈 제목
    type: String,
    required: true
  },
  content: { // 이슈 내용
    type: String,
    required: true
  },
  count: { // 이슈 할당 인원수
    type: Number,
    required: true
  },
  rewards: { // 보상금액
    type: Number,
    required: true
  },
  dueDate: { // 마감일
    type: Date,
    required: true
  },
  status: { // 진행상태
    type: String,
    required: true
  },
  assignee_email: [String]
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
