var config = require('./config.js');

exports.createRoutes = function (app, database) {

	/*
	** User creation
	*/

	app.put("/api/user", function(req, res) {

		if (req.session.user)
		{
			res.send(409, "You are connected, you can't create an account");
			return false;
		}

		var email = req.param('email');
		var password = req.param('password');
		if (!email || !password || email.length < 3 || password.length < 3)
		{
			res.send(400, "Please provide a correct email and a correct password");
			return false;
		}
		database.createUser(email, password, function (user, err) {
			if (err)
			{
				console.log("[error] user %s already exist", email);
				res.send(409, "This user already exist");
				return false;
			}
			console.log("[info ] Creating new user %s", email);
			req.session.user = user;
			res.send(200, "User created");
		});
	});

	/*
	** User delete
	*/

	app.delete("/api/user", function(req, res) {
		if (!req.session.user)
		{
			res.send(401, "You are not connected");
			return false;
		}

		database.deleteUser(req.session.user, function() {
			delete req.session.user;
			res.send(200, "User deleted");
		});
	});

	/*
	** Login
	*/

	app.post("/api/login", function (req, res) {

		if (req.session.user)
		{
			res.send(200, "Already connected");
			return true;
		}

		var email = req.param('email');
		var password = req.param('password');
		if (!email || !password || email.length < 3 || password.length < 3)
		{
			res.send(400, "Please provide a correct email and a correct password");
			return false;
		}
		database.loginUser(email, password, function(user) {
			if (!user)
			{
				console.log("[error] connection error for user %s", email);
				res.send(401, "Wrong email or password");
				return false;
			}
			req.session.user = user;
			console.log("[info ] user %s connected", email);
			res.send(200, "Connected");
		});
	});

	/*
	** Logout
	*/

	app.post("/api/logout", function (req, res) {
		if (!req.session.user)
		{
			res.send(401, "You are not connected");
			return false;
		}
		delete req.session.user;
		res.send(200, "Logged out");
	});

};
