const mongoose = require('mongoose');
require('dotenv').config();
require('./mvc/models/db');
setTimeout(() => {
  const User = mongoose.model('User');
  const user = new User();
  user.name = 'Test User';
  user.email = 'checkuser20260725@example.com';
  user.setPassword('12345678');
  user.save((err, newUser) => {
    if (err) {
      console.error('SAVE_ERROR', err);
      process.exit(0);
    }
    console.log('SAVED', newUser && newUser._id);
    process.exit(0);
  });
}, 2000);
