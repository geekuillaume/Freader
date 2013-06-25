var fs = require('fs');
var express = require('express');

exports.createRoutes = function (app, database) {

	/*
	** Serving index.html manually to set if user is connected or not
	*/

	app.get("*", function (req, res) {
		fs.readFile(__dirname + '/index.html', 'utf-8', function (err, data) {
			if (req.session.user)
				data = data.replace("{{alreadyLogged}}", "true");
			else
				data = data.replace("{{alreadyLogged}}", "false");
			res.send(data);
		});
	});
}
