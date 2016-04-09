/* jshint esversion:6, node:true, undef:true*/
const bcrypt = require('bcryptjs');
const db = require('./mongooseSetup.js');

//used in local-signup strategy
exports.localReg = function (username, password, email) {
  var hash = bcrypt.hashSync(password, 8);
  var newUser = {
    "username": username,
    "passwordHash": hash,
    "email": email
  };
  //check if username is already assigned in our database
  return db.User.find({ username: username }).exec()
  .then(function (result){ //case in which user already exists in db
    
    if(result.length){
      console.log('username already exists');
      throw "Username already exists"; //username already exists
    } else {
       console.log('Username is free for use');
       return db.User.create(newUser)
       .then(function(savedUser){
         return savedUser;
       });         
    }
  });
};

//check if user exists
    //if user exists check if passwords match (use bcrypt.compareSync(password, hash); // true where 'hash' is password in DB)
      //if password matches take into website
  //if user doesn't exist or password doesn't match tell them it failed
exports.localAuth = function (username, password) {
   if(!username || !password) return null;

   return db.User.findOne({ username: username }).exec()
   .then(function (result){
      if(result){
         var hash = result._doc.passwordHash;

         if(!hash){
            console.warn("User " + username + " has no password set");
            return null;
         }
         
         if (bcrypt.compareSync(password, hash)) {
            return result;
         } else {
            return null;
         }
      } else {
         return null;
      }
   },
      function(reason){
         console.error("Failed to login: " + reason);
         throw new Error(reason);
      }
   );
};