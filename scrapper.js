var http = require('http');
var config = require(__dirname + '/config.js');
var parseXML = require('xml2js').parseString;

exports.scrap = function (feed, callback) {

	http.get(feed.url, function (res) {
		var body = "";


		res.on('data', function (chunk) {
			body += chunk;
		});

		res.on('end', function () {
			// Got all response, now parsing...

			if (!body || res.statusCode !== 200)
				return callback({message: "Invalid Feed"});

			parseXML(body, function (err, rss) {
				if (err)
					return callback({message: "Not a valid RSS feed"});
				var items = [];

				try {
					for (var i = 0; i < config.maxItems && i < rss.rss.channel[0].item.length - 1; i++) {
						items.push({
							title: rss.rss.channel[0].item[i].title[0],
							link: rss.rss.channel[0].item[i].guid[0]._,
							description: rss.rss.channel[0].item[i].description[0]
						})
					};

					var feed = {
						name: rss.rss.channel[0].title,
						description: rss.rss.channel[0].description,
						link: rss.rss.channel[0].link,
						items: items
					};
				}
				catch (e) { // If not all the fiels are inside the feed
					return callback({message: "Not a valid RSS feed"});
				}
				callback(err, feed);
			});

		});

	}).on('error', function (error) {
		console.log("error while getting feed", error);
		callback(error, null);
	});

}
