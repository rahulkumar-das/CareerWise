var express = require('express');
var router = express.Router();
const mongoose= require('mongoose');
const passport = require('passport');
const User = mongoose.model("User");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
const mailgun = require("mailgun-js");

//Demo purpose
const DOMAIN = process.env.DOMAIN_KEY;
const api_key = process.env.API_KEY;
const mg = mailgun({apiKey: api_key, domain: DOMAIN});


 const updatePassword= function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
          //req.flash('error', 'No account with that email address exists.');
          console.log('No account with that email address exists.');
          return res.json({ message: "Email id doesn't exist" });
          }
  
          user.resetPasswordToken = token;
         
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
         var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: process.env.SENDER_EMAIL,
           pass: process.env.SENDER_PASS
           
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'Career Wise Team',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            process.env.RESET_ADDRESS+'/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
       //  req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        }); 

        //for Demo Purpose
/* 
        const data = {
          from: 'Career Site <me@samples.mailgun.org>',
          to: user.email,
          subject: 'Career Site Password Reset Request',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://localhost:4200/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        mg.messages().send(data, function (err, body) {
          console.log(body);
          //req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done')
        }); */
      }
    ], function(err) {
      if (err) return next(err);
      //res.render('forgot', {error: false, success:req.flash('success')});
      res.status(200).json({ message: 'Email is sent. Please Check' });
    });
  };

 const invalidToken= function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            //req.flash('error', 'Password reset token is invalid or has expired.');
            console.log('Password reset token is invalid or has expired inside invalidToken.');
            return res.redirect('/forgot');
        }
        res.render('/reset', { token: req.params.token });
    });
};




  const resetPassword = function(req, res) {
    async.waterfall([
        function(done) {

            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (!user) {
                    console.log('Password reset token is invalid or has expired.');
                    return res.json({ message: "Password reset token is invalid or has expired" });
                }
                if (req.body.password === req.body.password_confirm) {
                    //passowrd is changed and token and date are cleared

                    user.setPassword(req.body.password);
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                   // console.log('password' + user.password + 'and the user is' + user)

                    user.save((err, newUser) => {
                        if (err) {
                            res.status(400).json(err);

                        } else {
                            done(err, newUser); //important

                        }

                    });
                } else {
                    //req.flash("error", "Passwords do not match.");
                    
                    return res.redirect('back');
                }
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                     user: process.env.SENDER_EMAIL,
                    pass: process.env.SENDER_PASS
                    
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'Career Wise Team',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                //req.flash('success', 'Success! Your password has been changed.');
                done(err);
            }); 

            //// For demo purpose
          /*   const data = {
              from: 'Career Site <me@samples.mailgun.org>',
              to: user.email,
              subject: 'Career Site Password Reset Successful',
              text: 'Hello,\n\n' +
              'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            mg.messages().send(data, function (err, body) {
              console.log(body);
              done(err, 'done')
            }); */
        }
    ], function(err) {
        //if (err) return next(err);
        res.status(200).json({ message: "Password Updated Successfully" });


    });
}
 
  
  module.exports = {
      updatePassword,
      invalidToken,
      resetPassword
  };