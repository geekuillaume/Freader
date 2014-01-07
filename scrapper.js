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
					return callback({message: "Invalid Feed"});

				feed = parseRSS(rss);
				if (!feed)
					feed = parseAtom(rss);
				if (!feed)
					return callback({message: "Invalid Feed"});
				callback(err, feed);
			});

		});

	}).on('error', function (error) {
		console.log("error while getting feed", error);
		callback(error, null);
	});

}


var parseRSS = function (rss) {
	try {
		var items = [];
		for (var i = 0; i < config.maxItems && i < rss.rss.channel[0].item.length - 1; i++) {
			items.push({
				title: rss.rss.channel[0].item[i].title[0],
				link: rss.rss.channel[0].item[i].link[0],
				description: rss.rss.channel[0].item[i].description[0]
			})
		};

		var feed = {
			name: rss.rss.channel[0].title,
			description: rss.rss.channel[0].description,
			link: rss.rss.channel[0].link,
			items: items
		};
		return feed;
	}
	catch (e) { // If not all the fiels are inside the feed
		return null;
	}
}
var parseAtom = function (rss) {
	try {
		var items = [];
		for (var i = 0; i < config.maxItems && i < rss.feed.entry.length - 1; i++) {
			items.push({
				title: rss.feed.entry[i].title[0]._,
				link: rss.feed.entry[i].link[0].$.href,
				description: rss.feed.entry[i].content[0]._
			})
		};
		var feed = {
			name: rss.feed.title,
			description: "No description",
			link: rss.feed.link[0].$.href,
			items: items
		};
		return feed;
	}
	catch (e) { // If not all the fiels are inside the feed
		console.log(e);
		return null;
	}
}

