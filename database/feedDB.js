var mongoose = require('mongoose');
var User = require(__dirname + '/userDB.js');

var feedSchema = mongoose.Schema({
	name: { type: String, default: "Loading..." },
	url: String,
	_owners: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	creationDate: { type: Date, default: Date.now }
});

var Feed = mongoose.model('Feed', feedSchema);
exports.model = Feed;

exports.add = function(user, url, callback) {
	Feed.findOne().where('url').equals(url).exec(function (err, feed) {
		if (feed) // Feed already in database, reference to user
		{
			if (feed._owners.indexOf(user._id) == -1)
			{
				Feed.update({_id: feed._id}, {'$push': {_owners: user._id}}).exec(function() {
					User.model.update({_id: user._id}, {$push: {_feeds: feed._id}}).exec(callback);
				});
			}
			else
				callback(2);
		}
		else // Create feed in database and reference to user
		{
			feed = new Feed({url: url, _owners: [user._id]});
			feed.save(function(err) {
				User.model.update({_id: user._id}, {$push: {_feeds: feed._id}}).exec(function (err) {
					callback(err, feed);
				});
			});
		}
		return true;
	});
}

exports.delete = function(user, feedID, callback) {
	if (user._feeds.indexOf(feedID) == -1)
		return callback(true);
	Feed.findOne().where('_id').equals(feedID).exec(function (err, feed) {
		if (!feed || err)
			return callback(err);
		if (feed._owners.length == 1) // No more owners, removing feed from database
			Feed.remove({_id: feed._id}).exec();
		var index = user._feeds.indexOf(feedID);
		var toUnset = {};
		toUnset['_feeds.' + index] = 1;
		User.model.update({_id: user._id}, {$unset: toUnset}).exec(callback); // Unsetting feed from user
	});
}

exports.get = function(user, callback) {
	User.model.findOne().where('_id').equals(user._id).populate('_feeds').exec(function (err, user) {
		callback(err, user._feeds);
	});
}
