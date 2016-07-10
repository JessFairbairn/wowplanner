/* jshint esversion:6, node:true, undef:true*/
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/wowdb');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connected to mongoose!");
});
mongoose.Promise = global.Promise;


const userSchema = mongoose.Schema({
	username: String,
	passwordHash: String,
	email: String,
	tasks: [{
		ID: Number,
		title: String,
		_deadline: Date,
		priority: Number,
		isComplete: Boolean,
		tags: [String],
		prerequisites:[Number],
		_scheduledDate: Date,

		//generated serverside:
		serverID: String
	}]
});

exports.User = mongoose.model("User",userSchema);