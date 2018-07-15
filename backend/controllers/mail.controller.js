var jwt = require('jsonwebtoken');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var User = require('../models/user.model');
var config = require('../config/config');
var nodemailer = require('nodemailer');
var Email = require('email-templates');
var crypto = require('crypto'); 
var fs = require("fs");
var ejs = require('ejs');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: config.smtp.user,
         pass: config.smtp.pass
     }
 });

 const encode = function(_id, email) {
  var cipher = crypto.createCipher('aes-256-cbc', 'CHANGE_THIS_TO_SOMETHING_RANDOM') // TODO
  var result = cipher.update(_id + '::' + email + '::' + Date.now(), 'utf8', 'base64')
  return result += cipher.final('base64')
 }
 
/**
 * Send invitation
 * @param {string} req.body.email - email of new user.
 * @param res
 * @param next
 * @returns {*}
 */
function sendInvitation(req, res, next) {
  var invitationFrom = req.user.name + '(' + req.user.email + ')';
  var invitationLink = 'http://' + config.domain  + '/invitation/' + encode(req.receiver._id, req.receiver.email);

  ejs.renderFile(__dirname + "/../emails/invite.ejs", {
    'invitationFrom': invitationFrom, 
    'invitationLink': invitationLink,
    'groupName': 'JAVACAFE',
    'contact': config.smtp.user
  }, function (err, data) {
    if (err) {
        console.log(err);
    } else {
      var mailOptions = {
        from: 'no-reply@community.com', // sender address
        to: req.receiver.email, // list of receivers
        subject: 'Invitation to join Community Rewards', // Subject line
        html: data
      };
      
      transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          next(err);
        else
          res.json(info);
      });
    }  
  });

}

module.exports = { sendInvitation};