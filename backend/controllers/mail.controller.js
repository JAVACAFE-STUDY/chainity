var jwt = require('jsonwebtoken');
var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var User = require('../models/user.model');
var config = require('../config/config');
var nodemailer = require('nodemailer');
var crypto = require('crypto'); 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: config.smtp.user,
         pass: config.smtp.pass
     }
 });

 const encode = function(email) {
  var cipher = crypto.createCipher('aes-256-cbc', 'CHANGE_THIS_TO_SOMETHING_RANDOM') // TODO
  var result = cipher.update(email + '::' + Date.now, 'utf8', 'base64')
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
  console.log(req.receiver)
  console.log(req.user)
  var invitationFrom = req.user.email + '(' + req.user.name + ')';
  var invitationLink = 'http://' + config.domain  + '/invitation/' + encode(req.receiver.email);
  var mailOptions = {
    from: 'no-reply@community.com', // sender address
    to: req.receiver.email, // list of receivers
    subject: 'Invitation to join Community Rewards', // Subject line
    html: '<ul><li>Invitaion from: '+ invitationFrom +'</li>' +
          '<li>Invitaion link: <a href="'+ invitationLink +'" target="_blank">Registration in a new tab</a></li></ul>'
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      next(err);
    else
      res.json(info);
  });
}

module.exports = { sendInvitation};