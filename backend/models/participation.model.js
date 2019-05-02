var Promise = require('bluebird');
var mongoose = require('mongoose');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var config = require('../config/config');
var ObjectID = require('mongodb').ObjectID

/**
 * Participation Schema
 */
const ParticipationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issues',
    required: true
  },
  participant: {
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
ParticipationSchema.method({
});

/**
 * Statics
 */
ParticipationSchema.statics = {
  /**
   * @param {number} offset - Number of issues to be skipped.
   * @param {number} limit - Limit number of issues to be returned.
   * @returns {Promise<Issue[]>}
   */
  list({ limit = 0, offset = 0 , q = {}} = {}) {
    return this.find(q)
    //   .populate('createdBy')
      .sort({ createdAt: -1 })
      .limit(+limit)
      .skip(+offset)
      .exec();
  }
};

/**
 * @typedef Participation
 */
module.exports = mongoose.model('Participation', ParticipationSchema);