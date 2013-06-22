var config = require('./config.js');
var mongoose = require('mongoose');


exports.connect = function(callback) {
	console.log("Connecting to database...");
	mongoose.connect(config.database);

	db = mongoose.connection;
	db.on('error', console.error.bind(console, 'Connection error:'));
	db.once('open', function() {
		console.log("Connected !");
		callback();
	});
};

var userSchema = mongoose.Schema({
	email: String,
	password: String,
	creationDate: { type: Date, default: Date.now }
});

var User = mongoose.model('User', userSchema);

exports.createUser = function(email, password, callback) {
	User.find().where("email").equals(email).exec(function (err, user) {
		if (user.length || err)
		{
			callback(null, true);
			return false;
		}
		var newUser = new User({email: email, password: password});
		newUser.save(function (err) {
			return callback(this, err);
		});
	});
}

exports.deleteUser = function(user, callback) {
	User.remove({email: user.email}, callback);
}

exports.loginUser = function(email, password, callback) {
	User.findOne().where("email").equals(email).exec(function (err, user) {
		console.log(user);
		if (!user || password != user.password)
		{
			callback(false);
			return false;
		}
		callback(user);
		return true;
	});
}
