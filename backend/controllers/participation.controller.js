var Participation = require('../models/participation.model');

/**
 * Get participations list.
 * @property {number} req.query.offset - Number of issues to be skipped.
 * @property {number} req.query.limit - Limit number of issues to be returned.
 * @returns {Issue[]}
 */
function list(req, res, next) {
  const { limit = 0, offset = 0 } = req.query;
  Participation.list({ limit, offset })
    .then(participations => {
      let result = {
        totalDocs: participations.length,
        offset: req.query.offset,
        limit: req.query.limit,
        docs: participations
      };
      res.json(result);
    })
    .catch(e => next(e));
}

module.exports = { list };
