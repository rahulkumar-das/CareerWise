# CareerWise
A website that allows different users to connect with each other other users by registering on the website. It has various features that are described below.

# Features
- [x] Login and SignUp using Jwt Authentication
- [x] Token based reset url to reset password
- [x] Post text content
- [x] Like post
- [x] Comment on Post
- [x] Send message to other users
- [x] Send a friend request
- [x] Accept/ Reject friend request
- [x] Can view other user's post only if added as a connection

# Tech Frameworks used
* Back end: [Node](https://nodejs.org/en/docs/), [Express](https://expressjs.com/en/guide/routing.html) 
* Database: [MongoDB](https://docs.mongodb.com/)
* Front end: [Angular](https://angular.io/docs)
* Authentication: [JsonWebtokens](https://jwt.io/introduction/)

# For developers
* Clone the source locally:
1) To install the dependencies
```
$git clone https://github.com/rahulkumar-das/CareerWise.git
$npm install
$cd angular
$npm install

```
2) Before running the server and frontend,
create a .env file outside mvc folder to assign the process.env variables:

```
JWT_SECRET=<Any 32 bit random alphanumeric characters>
SENDER_EMAIL=<your email address>
SENDER_PASS=<your email account password>
RESET_ADDRESS= http://localhost:4200

```

3) To run the server
The node server runs at http://localhost:3000/
```
$nodemon
```
4) To run the angular server
The angular server runs at http://localhost:4200/
```
$cd angular
$ng serve
```


# Screenshots
### Registration Page
![reg](https://user-images.githubusercontent.com/48314756/87870032-fbe23b00-c9c1-11ea-862c-30f2a6feba31.JPG)

### Login Page
![login](https://user-images.githubusercontent.com/48314756/87870026-f2f16980-c9c1-11ea-95ee-b1fac01862ea.JPG)

### Feed Page
![feed](https://user-images.githubusercontent.com/48314756/87870024-ef5de280-c9c1-11ea-8baa-0739c5ff504d.JPG)

### Profile Page
![profile](https://user-images.githubusercontent.com/48314756/87870030-f7b61d80-c9c1-11ea-9af3-4fb89f7598be.JPG)
### Profile page displaying random connections
![profile2](https://user-images.githubusercontent.com/48314756/87870031-f8e74a80-c9c1-11ea-8485-7b18149e75e7.JPG)

### Messaging Page
![messaging](https://user-images.githubusercontent.com/48314756/87870027-f2f16980-c9c1-11ea-8db9-5dda31d72cf2.JPG)

### Alerts
![alert](https://user-images.githubusercontent.com/48314756/87870019-e836d480-c9c1-11ea-946a-4bc169d315e0.JPG)

### Friend Request
![friendReq and noti](https://user-images.githubusercontent.com/48314756/87870021-eec54c00-c9c1-11ea-8587-24b6f5964626.JPG)

## Preview of reset url email with instructions
![Capture1](https://user-images.githubusercontent.com/48314756/87554739-24241e00-c6d2-11ea-92ef-04ddf0a89757.JPG)

## Preview of confirmation email
![Capture2](https://user-images.githubusercontent.com/48314756/87554767-2d14ef80-c6d2-11ea-97ab-f97f3897a466.JPG)





