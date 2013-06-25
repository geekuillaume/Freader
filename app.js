var config = require(__dirname + '/config.js');
var database = require(__dirname + '/database/database.js');

var express = require('express');
var app = express();

/*
** Express Configuration
*/

// app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: config.cookieSecret}));
app.use(express.static(__dirname + '/webapp'));
app.use(app.router);



/*
** User Routes (creation, login, logout)
*/

var user = require(__dirname + '/user.js');
user.createRoutes(app, database);

/*
** Feeds Routes (creation, login, logout)
*/

var feeds = require(__dirname + '/feeds.js');
feeds.createRoutes(app, database);

/*
** Static files for web application
*/

var webapp = require(__dirname + '/webappServing.js');
webapp.createRoutes(app, database);


database.connect(function () {
	app.listen(config.port);
	console.log("Server started and listening on port " + config.port);
});
