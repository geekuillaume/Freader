var http = require('http');
var parseXML = require('xml2js').parseString;

exports.scrap = function (feed, callback) {

	http.get(feed.url, function (res) {
		var body = "";

		res.on('data', function (chunk) {
			body += chunk;
		});

		res.on('end', function () {
			// Got all response, now parsing...

			parseXML(body, function (err, result) {
				callback(err, result);
			});

		});

	}).on('error', function (error) {
		callback(error, null);
	});

}
