const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/users');
const middleware = require('../routes/middleware/middleware');




//Logging in and registering
router.post('/register', userCtrl.registerUser);
router.post("/login", userCtrl.loginUser);


//Get Requests
router.get("/generate-feed",middleware.authorize, userCtrl.generateFeed)
router.get("/get-user-data/:userid", middleware.authorize, userCtrl.getUserData)
router.get("/get-search-results",middleware.authorize, userCtrl.getSearchResults)


//Routes Handling Friend Requests
router.get("/get-friend-requests", middleware.authorize, userCtrl.getFriendRequests)
router.post("/make-friend-request/:from/:to", middleware.authorize, userCtrl.makeFriendRequest)
router.post("/resolve-friend-request/:from/:to", middleware.authorize, userCtrl.resolveFriendRequest)

//Routes Handling Posts
router.post("/create-post", middleware.authorize, userCtrl.createPost)
router.post("/like-unlike/:ownerid/:postid", middleware.authorize, userCtrl.likeUnlike)
router.post("/post-comment/:ownerid/:postid", middleware.authorize, userCtrl.postCommentOnPost)

//Routes Handling Messages
router.post("/send-message/:to", middleware.authorize, userCtrl.sendMessage)
router.post("/delete-message/:messageid", middleware.authorize, userCtrl.deleteMessage)
router.post("/reset-message-notifications", middleware.authorize, userCtrl.resetMessageNotifications)

//Misc route
router.post("/reset-alert-notifications", middleware.authorize, userCtrl.resetAlertNotifications)


//=============================================
//Only for development and testing purpose only
router.delete("/all", userCtrl.deleteAllUsers);
router.get("/all", userCtrl.getAllUsers);


module.exports = router;


 



