var config = require('./config.js');
var database = require('./database.js');

var express = require('express');
var app = express();

/*
** Express Configuration
*/

// app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: config.cookieSecret}));

/*
** User Routes (creation, login, logout)
*/

var user = require('./user.js');
user.createRoutes(app, database);


database.connect(function () {
	app.listen(config.port);
	console.log("Server started and listening on port " + config.port);
});
