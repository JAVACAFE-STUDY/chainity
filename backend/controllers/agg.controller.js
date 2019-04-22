var User = require('../models/user.model');

/**
 * Get participations aggregation.
 * @property {number} req.query.startDate
 * @property {number} req.query.endDate
 * @returns {User[]}
 */
function aggParticipations(req, res, next) {
  const { startDate = '1000-01-01', endDate = '9999-12-31', limit = 0} = req.query;
  User.aggList({ startDate, endDate })
    .then(docs => {
      for (i in docs) {
        var tokens = 0;
        for (j in docs[i].tokens) {
            tokens += docs[i].tokens[j].tokens;
        }
        docs[i].countOfPartipations = docs[i].countOfPartipations.length;
        docs[i].tokens = tokens;
        tokens = 0;
      }
      // Sort countOfPartipations descending 
      docs.sort(function (a, b) {
        return a.countOfPartipations < b.countOfPartipations;
      });
      // Delete if countOfPartipations is zero
      docs = docs.filter(function(item){ return item.countOfPartipations !== 0; });
      // limit
      if(limit > 0) {
        docs = docs.splice(0, limit);
      }

      res.json({ docs: docs });
    })
    .catch(e => next(e));
}

module.exports = { aggParticipations };
