var Reward = require('../models/reward.model');

/**
 * Get rewards list.
 * @property {number} req.query.offset - Number of issues to be skipped.
 * @property {number} req.query.limit - Limit number of issues to be returned.
 * @returns {Issue[]}
 */
async function list(req, res, next) {
  const { limit = 0, offset = 0 } = req.query;
  
  let result = {
    offset: req.query.offset,
    limit: req.query.limit,
    totalDocs: await Reward.count(),
    docs: await Reward.list({ limit, offset })
  };

  res.json(result)
}

module.exports = { list };
