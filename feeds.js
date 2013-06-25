var config = require('./config.js');

exports.createRoutes = function(app, database) {

	app.get('/api/feeds', function (req, res) {
		if (!req.session.user)
		{
			res.send(401, "Loging required");
			return false;
		}
		database.feed.get(req.session.user, function (err, feeds) {
			res.send(feeds);
		});
		console.log("[info ] Getting feeds of user : %s", req.session.user.email);
	});

	app.post('/api/feed', function (req, res) {
		if (!req.session.user)
		{
			res.send(401, "Loging required");
			return false;
		}
		var url = req.param('url');
		if (!url || !url.match(config.urlRegex))
		{
			res.send(400, "Please provide a valid url");
			return false;
		}
		database.feed.add(req.session.user, url, function (err, feed) {
			if (err == 2)
				return res.send("Feed already added");
			res.send("Feed added");
			req.session.user._feeds.push(feed._id);
			console.log("[info ] Added feed (%s) to user : %s", url, req.session.user.email);
		});
	});

	app.delete('/api/feed/:id', function (req, res) {
		if (!req.session.user)
		{
			res.send(401, "Loging required");
			return false;
		}
		database.feed.delete(req.session.user, req.params.id, function (err, nb) {
			if (err)
				res.send(400, "No feed with this ID");
			else
				res.send("Feed deleted");
			console.log("[info ] Feed %d deleted by user %s", req.params.id, req.session.user.email)
		});
	});

	app.get('/api/feed/:id', function (req, res) {
		if (!req.session.user)
		{
			res.send(401, "Loging required");
			return false;
		}
		database.feed.getOne(req.params.id, function (err, data) {
			if (err)
				return res.send(400, err.message);
			res.send(data);
		});
	});

}
