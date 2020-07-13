const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/users');
const middleware = require('../routes/middleware/middleware');





router.post('/register', userCtrl.registerUser);

router.post("/login", userCtrl.loginUser);

router.get("/generate-feed",middleware.authorize, userCtrl.generateFeed)
router.get("/get-search-results",middleware.authorize, userCtrl.getSearchResults)
router.post("/make-friend-request/:from/:to", middleware.authorize, userCtrl.makeFriendRequest)
router.get("/get-friend-requests", middleware.authorize, userCtrl.getFriendRequests)
router.get("/get-user-data/:userid", middleware.authorize, userCtrl.getUserData)
router.post("/resolve-friend-request/:from/:to", middleware.authorize, userCtrl.resolveFriendRequest)
router.post("/create-post", middleware.authorize, userCtrl.createPost)
router.post("/like-unlike/:ownerid/:postid", middleware.authorize, userCtrl.likeUnlike)
router.post("/post-comment/:ownerid/:postid", middleware.authorize, userCtrl.postCommentOnPost)
router.post("/send-message/:to", middleware.authorize, userCtrl.sendMessage)



//Only for development purpose
router.delete("/all", userCtrl.deleteAllUsers);
router.get("/all", userCtrl.getAllUsers);
module.exports = router;


 



