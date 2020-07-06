const express = require('express');
const router = express.Router();

const forgotCtrl = require('../controllers/forgotPassword');




// to request for reset url
router.post('/forgot', forgotCtrl.updatePassword);

router.get('/reset/:token', forgotCtrl.invalidToken);

//to reset the password
router.post("/reset/:token", forgotCtrl.resetPassword);

//if the token is expired
//router.get('/reset/:token', forgotCtrl.resetInvalidToken);

module.exports = router;


