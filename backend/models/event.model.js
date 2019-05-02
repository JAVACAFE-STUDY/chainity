var Promise = require('bluebird');
var mongoose = require('mongoose');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var config = require('../config/config');

/**
 * Event Schema
 */
const EventSchema = new mongoose.Schema({
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
  startDate: {
    type: Date,
    required: false
  },
  finishDate: {
    type: Date,
    required: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isClosed: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  closedAt: {
    type: Date,
    required: false
  }
});

EventSchema.index({ title: "text", description: "text" });

/**
 * Methods
 */
EventSchema.method({
});

/**
 * Statics
 */
EventSchema.statics = {
  /**
   * @param {number} skip - Number of events to be skipped.
   * @param {number} limit - Limit number of events to be returned.
   * @returns {Promise<Event[]>}
   */
  list({ limit = 0, offset = 0, q = {} } = {}) {
    return this.find(q)
    //   .populate('createdBy')
      .sort({ createdAt: -1 })
      .limit(+limit)
      .skip(+offset)
      .exec();
  },

  /**
   * Get event
   * @param {ObjectId} id - The objectId of event.
   * @returns {Promise<Event, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((event) => {
        if (event) {
          return event;
        }
        const err = new APIError('등록되지 않은 이벤트입니다.', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  }
};

/**
 * @typedef Event
 */
module.exports = mongoose.model('Event', EventSchema);
