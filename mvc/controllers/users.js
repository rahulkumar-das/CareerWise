const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User'); // The model containing userSchema
//var User = require('../models/users.js'); 
const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');
const middleware = require('../routes/middleware/middleware');
const timeAgo = require("time-ago");

//to check if same id exist or not in friendRequest. Helper function
const containsDuplicate = function(array){
    array.sort();
    for(let i =0; i< array.length; i++){
        if(array[i]=== array[i+1]){
            return true;
        }
    }
}

//to get the commenter name from id and attach the profile image
const addCommentDetails = function(posts){
    return new Promise(function(resolve, reject){
        let promises =[];

        for(let post of posts){
            for(let comment of post.comments){
                let promise = new Promise(function(resolve, reject){
                    User.findById(comment.commenter_id, "name profile_image", (err, user)=>{
                        comment.commenter_name = user.name;
                        comment.commenter_profile_image = user.profile_image;
                        resolve(comment);
                    });
                });
                promises.push(promise);
            }
        }
        
        Promise.all(promises).then((val)=>{
            console.log(val);
            resolve(posts);
        })
    });
}

const registerUser = function({ body }, res) {

console.log(body);

    if (!body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.password ||
        !body.password_confirm
    ) {
        return res.send({ message: "All fields are must" });
    }

    if (body.password != body.password_confirm) {
        return res.send({ message: "Passwords don't match" });
    }

    const user = new User();

    //user.firstname = body.first_name.trim();
    //user.lastname = body.last_name.trim();
    // if a person has only first name for them changes have been made to schema
    user.name = body.first_name.trim()+" "+body.last_name.trim();

    user.email = body.email;
    user.setPassword(body.password);

    //save the user in database
    user.save((err, newUser) => {
        if (err) {
            if (err.errmsg && err.errmsg.includes("duplicate key error") && err.errmsg.includes("email" )) {
               console.log(err)
                return res.json({ message: "The provided email is already registered!" , err:err});
                
            }


            return res.json({ message: "Something went wrong" });

        } else {
            const token = newUser.getJwt();
            res.status(201).json({ token });

        }

    });

}

const loginUser = function(req, res) {
    //To check if user entered all fields
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    //This method will call the strategy method from passport.js
    passport.authenticate("local", (err, user, info) => {
        if (err) { return res.status(404).json(err) }
        if (user) {
            const token = user.getJwt();
            res.status(200).json({ token })
        } else {
            res.json(info)
        }


    })(req, res)


}

const generateFeed = function({payload}, res){

    const posts=[];
    const maxAmountOfPost = 48;

    //need to update this function
    function addToPosts(array, user){
        for( item of array){
            item.name=user.name;
            item.ago= timeAgo.ago(item.date)
            item.ownerProfileImage = user.profile_image;
            item.ownerid = user.ownerid
        }
    }


    let myPosts = new Promise(function(resolve, reject){
        User.findById(payload._id, "name profile_image posts friends",{lean: true}, (err,user)=>{
            if(err){
                return res.json({err: err});
            }
            addToPosts(user.posts, user)
            posts.push(...user.posts);
            resolve(user.friends);
        });

    });

    let myFriendsPosts = myPosts.then((friendsArray)=>{
        return new Promise(function(resolve, reject){
            User.find({ '_id':{ $in: friendsArray} }, "name profile_image posts", {lean: true}, (err, users)=>{
                if(err){
                    return res.json({err:err});
                }
                for(user of users){
                    addToPosts(user.posts, user)
                    posts.push(...user.posts)
                }
                resolve();
            });
        });
    });

    myFriendsPosts.then(()=>{
        
        posts.sort((a,b)=>(a.date>b.date)? -1:1);
        posts.slice(0,maxAmountOfPost);
        addCommentDetails(posts).then((posts)=>{

            res.statusJson(200,{ posts: posts});
        })
    });

}

const getSearchResults = function({ query, payload }, res ){
    if(!query.query){
        return res.json({ err:"Missing a query"});
    }
    //console.log(query);
    //using regex to find name and i stands to ignore the case
    User.find({name: { $regex: query.query, $options: "i"}}, "name profile_image friends friend_requests", (err, results)=>{
        if(err){
            return res.json({err:err});
        }

        results = results.splice(0,20); //only 20 records per page
        for(i=0; i<results.length;i++){
            /* console.log("=============")
            console.log(typeof results[i]._id)
            console.log(typeof payload._id)
            console.log("=============") */
            if(results[i]._id == payload._id){ // this loop disables the owner account in the search results
                results.splice(i,1);
                break;
            }
        }


        return res.status(200).json({ message: "Getting search results", results: results});
    });
}

//this route is only for development purpose
const deleteAllUsers = function(req, res){
    User.deleteMany({}, (err, info)=>{
        if(err){
            return res.send({ error: err});
        }
        
        return res.json({ message: "Deleted all users", info: info});
    })
}

const makeFriendRequest=function ({params}, res) {
    
    User.findById(params.to, (err, user)=>{
        //console.log(user)
        if(err){
            return res.json(err);
        }

        if(containsDuplicate([params.from, ...user.friend_requests])){
            return res.json({ message: "Friend request is already sent"})

        }

        user.friend_requests.push(params.from);
        user.save((err,user)=>{
            if(err){
                return res.json(err);
            }
            
            //console.log(user);
            return res.statusJson(201,({ message:"Successfully friend request sent"}))
        })
    })
}

const getUserData = function({params}, res){
   // res.statusJson(200, {message: "Placeholder data"})
   User.findById(params.userid, (err,user)=>{
       if(err){
           return res.json({err: err});
       }
       res.statusJson(200,{ user: user})
   });
}

const getFriendRequests = function({query}, res){

    let friendRequests = JSON.parse(query.friend_requests)
    User.find({'_id': { $in: friendRequests}}, "name profile_image", (err,users)=>{
        if(err){
            return res.json({err:err})
        }
        return res.statusJson(200,{ message: "Getting friend requests", users: users})
    })   
    
    //return res.statusJson(200,{ message: "Getting friend requests", users: friendRequest})
}

const resolveFriendRequest = function({query, params }, res){
    User.findById(params.to, (err,user)=>{
        if(err){
            res.json({ err: err});
        }

        for(let i=0; i<user.friend_requests.length;i++){
            if(user.friend_requests[i]==params.from){
                user.friend_requests.splice(i,1);
                break;
            }
        }

        let promise = new Promise(function(resolve, reject){

            if(query.resolution == "accept"){

                if(containsDuplicate([params.from, ...user.friends])){
                    return res.json({ message: "Duplicate Error."})
                }

                user.friends.push(params.from);

                User.findById(params.from, (err, user)=>{
                    if(err){
                        res.json({ err: err});
                    }
                    if(containsDuplicate([params.to, ...user.friends])){
                        return res.json({ message: "Duplicate Error."})
                    }

                    user.friends.push(params.to);
                    user.save((err,user)=>{
                        if(err){
                            res.json({ err: err});
                        }
                        resolve();
                    });

                });

            } else{
                resolve();
            }
        });

        promise.then(()=>{
            user.save((err,user)=>{
                if(err){
                    res.json({ err: err});
                }

                res.statusJson(201,{ message: "Resolved friend request"});

            });

        });

    })
    
    
    
    //res.statusJson(201,{ message: "Resolve friend request", ...query, ...params});
}

const createPost = function({body, payload}, res){
    if(!body.content || !body.theme){
        return res.statusJson(400,{ message: "Insufficient data sent with request"});

    }    
    
    let userId= payload._id;
    const post = new Post();
    post.theme = body.theme;
    post.content = body.content;

    User.findById(userId, (err, user)=>{
        //console.log(user)
        if(err){
            return res.json({err:err});
        }

        let newPost = post.toObject();
        newPost.name = payload.name;
        newPost.ownerid=payload._id;
        newPost.ownerProfileImage=user.profile_image;
        console.log("This is newPost", newPost);
        user.posts.push(post);
        user.save((err)=>{
            if(err){
                return res.json({err:err});
            }
            return res.statusJson(201,{message: "Created Post", newPost: newPost});

        });
    });
}

//for development purpose-> to get all users
const getAllUsers = function(req, res){
    User.find((err, users)=>{
        if(err){
            return res.send({ error: err});
        }
        
        return res.json({ users:users});
    })
}

const likeUnlike = function({payload, params}, res){
    console.log(params)
   
    User.findById(params.ownerid, (err,user)=>{
    
        if(err){
            return res.json({err:err});
        }
        //.id is inbuilt function in mongoose to retrive the documents in collection
        const post = user.posts.id(params.postid);
        if(post.likes.includes(payload._id)){
            post.likes.splice(post.likes.indexOf(payload._id),1);
        }
        else{
            post.likes.push(payload._id);
        }

        user.save((err,user)=>{
            if(err){
                return res.json({err:err});
            }
            
            res.statusJson(201,{message:"Like or Unlike"});
        })
    })
   
}

const postCommentOnPost = function({ body, payload, params}, res){
    
    console.log(payload)
    User.findById(params.ownerid,(err,user)=>{
        console.log(params);
        
        if(err){
            console.log("Enter here")
            return res.json({err:user});
        }

        const post = user.posts.id(params.postid);

        let comment = new Comment();
        comment.commenter_id = payload._id;
        comment.comment_content = body.content;
        post.comments.push(comment);

        user.save((err,user)=>{
            if(err){
                return res.json({err:err});
            }

            User.findById(payload._id, "name profile_image", (err,user)=>{
                if(err){
                    return res.json({err:err});
                }
                res.statusJson(201,{message:"Posted Comment", comment: comment, commenter: user});
            });

        });
    });
    
}


module.exports = {
    registerUser,
    loginUser,
    generateFeed,
    getSearchResults,
    deleteAllUsers,
    makeFriendRequest,
    getUserData,
    getFriendRequests,
    resolveFriendRequest,
    createPost,
    getAllUsers,
    likeUnlike,
    postCommentOnPost
}