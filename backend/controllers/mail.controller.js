var jwt = require('jsonwebtoken');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var User = require('../models/user.model');
var config = require('../config/config');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var ejs = require('ejs');

const transporter = nodemailer.createTransport({
  sendmail: true,
  newline: 'windows',
  logger: false
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
        console.error(err);
        next(err);
    } else {
      var mailOptions = {
        from: config.smtp.user, // sender address
        to: req.receiver.email, // list of receivers
        subject: 'JAVACAFE 초대장', // Subject line
        html: data
      };
      
      transporter.sendMail(mailOptions, function (err, info) {
        // console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
        // console.log('Message sent successfully as %s', info.messageId);
        
        if(err)
          next(err);
        else
          res.json(info);
      });
    }  
  });

}

/**
 * Send approved
 * @param {string} req.body.email - email of user to be approved.
 * @param {string} req.body.name - name of user to be approved.
 * @param res
 * @param next
 * @returns {*}
 */
function sendApprovalComplete(req, res, next) {
  var receiver = {
    email : req.body.email,
    name : req.body.name
  }
  var loginLink = 'http://' + config.domain  + '/login';

  ejs.renderFile(__dirname + "/../emails/welcome.ejs", {
    'email': receiver.email, 
    'name': receiver.name,
    'loginLink': loginLink,
    'groupName': 'JAVACAFE',
    'contact': config.smtp.user
  }, function (err, data) {
    if (err) {
      console.error(err);
    } else {
      var mailOptions = {
        from: 'no-reply@community.com', // sender address
        to: receiver.email, // list of receivers
        subject: 'JAVACAFE 회원 가입 승인 안내', // Subject line
        html: data
      };
      
      transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          next(err);
        else
          res.json(info);
      });
    }
  })
}

module.exports = { sendInvitation, sendApprovalComplete};