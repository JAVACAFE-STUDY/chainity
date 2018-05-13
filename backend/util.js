var jwt = require('jsonwebtoken');

var util = {};
var secret = util.secret = process.env.JWT_SECRET || "CHANGE_THIS_TO_SOMETHING_RANDOM"; // super secret

util.successTrue = function(data){
  return {
    success:true,
    message:null,
    errors:null,
    data:data
  };
};

util.successFalse = function(err, message){
  if(!err&&!message) message = 'data not found';
  return {
    success:false,
    message:message,
    errors:(err)? util.parseError(err): null,
    data:null
  };
};

util.parseError = function(errors){
  var parsed = {};
  if(errors.name == 'ValidationError'){
    for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  } else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
    parsed.username = { message:'This username already exists!' };
  } else {
    parsed.unhandled = errors;
  }
  return parsed;
};

// middlewares
util.isLoggedin = function(req, res, next){
  var token = req.headers['x-access-token'];
  if (!token || token == 'undefined') return res.status(403).json(util.successFalse(null,'token is required!'));
  else {
    jwt.verify(token, secret, function(err, decoded) {
      if(err) return res.status(403).json(util.successFalse(err));
      else{
        req.decoded = decoded;
        next();
      }
    });
  }
};

module.exports = util;