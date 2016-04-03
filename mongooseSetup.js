/* jshint esversion:6, node:true, undef:true*/
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wowdb');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("connected!");
});
mongoose.Promise = global.Promise;


const userSchema = mongoose.Schema({
	username: String,
	passwordHash: String,
	email: String
});

exports.User = mongoose.model("User",userSchema);