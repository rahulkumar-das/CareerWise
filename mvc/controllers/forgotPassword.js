var express = require('express');
var router = express.Router();
const mongoose= require('mongoose');
const passport = require('passport');
const User = mongoose.model("User");
var async = require("async");
var crypto = require("crypto");
const mailgun = require("mailgun-js");

//Demo purpose
//const DOMAIN = process.env.DOMAIN_KEY;
//const api_key = process.env.API_KEY;
//const mg = mailgun({apiKey: api_key, domain: DOMAIN});

const createMailgunClient = function() {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;

  if (!apiKey || !domain) {
    return null;
  }

  return mailgun({ apiKey, domain });
};

 const updatePassword= function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        const email = String(req.body.email || '').trim().toLowerCase();

        if (!email) {
          return res.status(400).json({ message: 'Please provide an email address' });
        }

        User.findOne({ email: email }, function(err, user) {
          if (!user) {
          //req.flash('error', 'No account with that email address exists.');
          console.log('No account with that email address exists.');
          return res.status(404).json({ message: "Email id doesn't exist" });
          }
  
          user.resetPasswordToken = token;
         
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
         const resetBaseUrl = (process.env.RESET_ADDRESS || process.env.FRONTEND_URL || 'http://localhost:4200').replace(/\/$/, '');
         const mg = createMailgunClient();

         if (!mg) {
           return done(new Error('Mailgun is not configured. Set MAILGUN_API_KEY and MAILGUN_DOMAIN.'));
         }

         const mailData = {
          from: process.env.MAILGUN_FROM || 'Career Wise Team <mailgun@mg.yourdomain.com>',
          to: user.email,
          subject: 'Careerwise Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            `${resetBaseUrl}/reset/${token}` + '\n\n' +
            'If you did not request this, please ignore your password will remain unchanged.\n'
        };
        mg.messages().send(mailData, function(err, body) {
          if (err) {
            console.error('Mail send error:', err);
            return done(err);
          }
          console.log('mail sent', body && body.id ? body.id : '');
          done(null, 'done');
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
      if (err) {
        console.error('Forgot password flow error:', err);
        const details = err && err.response && err.response.body ? err.response.body : err && err.message ? err.message : 'Unknown mail error';
        return res.status(500).json({ message: 'Unable to send reset email. Please check the mail configuration.', error: details });
      }
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
            const mg = createMailgunClient();
            if (!mg) {
              return done(new Error('Mailgun is not configured. Set MAILGUN_API_KEY and MAILGUN_DOMAIN.'));
            }

            const mailData = {
                from: process.env.MAILGUN_FROM || 'Career Wise Team <mailgun@mg.yourdomain.com>',
                to: user.email,
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            mg.messages().send(mailData, function(err, body) {
                if (err) {
                    console.error('Password changed mail error:', err);
                    return done(err);
                }
                done(null, body);
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