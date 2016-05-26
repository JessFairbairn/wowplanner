/* jshint esversion:6, node:true, undef:true*/

const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const db = require('./mongooseSetup.js');
//const config = require('./config.js'), //config file contains all tokens and other private info
const funct = require('./authFunctions.js'); //funct file contains our helper functions for our Passport and database work



const app = express();


app.set('port', (process.env.PORT || 80));

app.use(express.static(__dirname /*+ '/public'*/));

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

//setting up bodyParser for post requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('views', __dirname/* + '/views'*/);
app.set('view engine', 'ejs');

// Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});

app.get('/', function(req, res) {
  res.render('pages/index');

  // if (req.cookies.user === undefined || req.cookies.pass === undefined){
  //     // res.render('login', 
  //     //    { locals: 
  //     //       { title: 'Hello - Please Login To Your Account' }
  //     //    }
  //     // );
  //  } else{
      
  //  }
});

app.post('/login',passport.authenticate('local-signin', 
	function(err, req, user) {
		//THIS IS PROBABLY ALL WRONG BUT OH WELL
		const res = req.res;
		
		if(err || !res){
			res.sendStatus(500);
		}
		else if(user !== false){
			res.send("Successfully Logged In");
			//TODO: Load app data
		}else{
			//failed authentication
			res.status(401).send("Authentication Failed");
		}
	}
));

app.get('/currentUsername', function(req, res, next){
  //debugger;
  if(!req.user){
    res.send({username:null});
  } else {
    var name = req.user.username;
    res.send({username:name});
  }
});

app.post('/register', passport.authenticate('local-signup')
);

app.post('/teapot', function(req, res){
	res.status(402).json("lol");
});

app.get('/logout', function(req, res){
	var name = req.user.username;
	console.log("LOGGIN OUT " + req.user.username);
	req.logout();
	//res.redirect('/');
	req.session.notice = "You have successfully been logged out " + name + "!";
});

app.get('/getUsers', function(req, res){
	var users;
	return db.User.find({}).exec().then(function (usersFound) {
		users = usersFound;
		console.log("Users found:");
		console.log(users);
 		res.send(JSON.stringify(users, null, 3));
 		return;
	},
	function(err){
		console.log("Error finding users: ");
		console.log(err);
		throw err;
	});
});

app.listen(app.get('port'), function() {
  console.log('WowServer is running on port', app.get('port'));
});

//===============PASSPORT=================
// Use the LocalStrategy within Passport to login/”signin” users.
passport.use('local-signin', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    funct.localAuth(username, password)
    .then(function (user) {
      if (user) {
        console.log("LOGGED IN AS: " + user.username);
        req.session.success = 'You are successfully logged in ' + user.username + '!';
        done(null, req, user);
      }
      if (!user) {
        console.log("COULD NOT LOG IN");
        req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
        done(null, req, false);
      }
    },
    function(err){
      done(err);
    })
    .catch(function (err){
      console.error(err.message);
      done(err);
    });
  }
));
// Use the LocalStrategy within Passport to register/"signup" users.
passport.use('local-signup', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    funct.localReg(username, password)
    .then(function (user) {
      if (user) {
        console.log("REGISTERED: " + user.username);
        req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT REGISTER");
        req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
        done(null, user);
      }
    })
    .catch(function (err){
      console.error(err.message);
    });
  }
));

// Passport session setup.
passport.serializeUser(function(user, done) {
  debugger;
  console.log("serializing " + user.username);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  debugger;
  console.log("deserializing " + obj);
  done(null, obj);
});