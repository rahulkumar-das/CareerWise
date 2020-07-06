const jwt = require('express-jwt');
const authorize = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

module.exports={
    authorize
}