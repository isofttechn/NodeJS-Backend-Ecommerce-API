const User = require("../models/user");
//GENERATE SIGNIN TOKEN
const jwt = require("jsonwebtoken");
//FOR AUTHORIZATION CHECK
const expressJwt = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.signup = (req, res) => {
  const user = new User(req.body);

  //console.log("req.body", req.body);

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err)
      });
    }
    //RETURNING FRIENDLY OUTPUT MESSAGE FOR USERS AFTER SIGNUP
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user
    });
  });
};

//EVERYTHING SIGNIN
exports.signin = (req, res) => {
  //FIND USER BASE ON EMAIL
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist."
      });
    }
    //AUTHENTICATE THE USER: IF USER IS FOUND
    //CREATE AUTHENTICATE METHOD IN USER MODEL
    //=== Using the authenticate method from user model
    if (!user.authenticate(password)) {
      res.status(401).json({
        error: "Email or password don't match with user in our database"
      });
    }

    //GENERATE A SIGNED TOKEN WITH USER ID  AND SECRET
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    //Persist the token as 't' in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    //RETURN RESPONSE WITH USER AND TOKEN TO FRONTEND CLIENT
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};

//SIGNOUT USERS
exports.signout = (req, res) =>{
  res.clearCookie('t')
  res.json({message: "You've been signout!"})
}



//REQUIRE SIGN IN
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth"
});



exports.isAuth = (req, res, next)=>{
  let user = req.profile && req.auth && req.profile._id == req.auth._id
  if(!user){
    return res.status(403).json({
      error: 'Access denied'
    });
  }
  next();
}



exports.isAdmin = (req, res, next)=>{
  if(req.profile.role === 0){
    return res.status(403).json({
      error: 'Admin resource! Access denied'
    });
  } 
  next();
};