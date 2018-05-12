var express = require('express');
var router = express.Router();
var jwt  = require('jsonwebtoken');
var util  = require('../util');

// login
router.post('/login',
  function(req,res,next){
    var isValid = true;
    var validationError = {
      name:'ValidationError',
      errors:{}
    };

    if(!req.body.email){
      isValid = false;
      validationError.errors.email = {message:'email is required!'};
    }
    if(!req.body.password){
      isValid = false;
      validationError.errors.password = {message:'password is required!'};
    }

    if(!isValid) return res.json(util.successFalse(validationError));
    else next();
  },
  function(req,res,next){
    var email = req.body.email;
    var password = req.body.password;

    if(email == "system" && password == "system") {
      console.log('email: ' + email);
      var payload = {
        _id : email,
        username: email
      };
      var options = {expiresIn: 60*60*24};
      jwt.sign(payload, util.secret, options, function(err, token){
        if(err) return res.json(util.successFalse(err));
        res.json(util.successTrue(token));
      });
    } else {
      res.status(403).json(util.successFalse(null,'email or password is invalid'));
    }
  }
);

// me
router.get('/me', util.isLoggedin,
  function(req,res,next) {
    res.json(util.successTrue(req.decoded._id));
    // User.findById(req.decoded._id)
    // .exec(function(err,user){
    //   if(err||!user) return res.json(util.successFalse(err));
    //   res.json(util.successTrue(user));
    // });
  }
);

module.exports = router;
