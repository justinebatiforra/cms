var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({port: 3000});

// routes
server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'public',
            listing: true
        }
    }
});

server.route({
    method: 'GET',
    path: '/flickr',
    handler: function (request, reply) {
        var credentials = require('./public/js/credentials.js'), // "./" means current folder; same as <script src="public/js/credentials.js"></script>
                httpRequest = require('request'),
                data = {
                    "method": 'flickr.photos.search',
                    "api_key": credentials.flickr.api_key,
                    "tags": 'Vancouver',
                    "extras": 'url_o, url_t',
                    "format": 'json',
                    "nojsoncallback": 1
                },
        options = {
            "uri": 'https://api.flickr.com/services/rest/',
            "qs": data
        };

        httpRequest(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                reply(body);

                // use classic javascript to iterate over response object and extract only the info necessary (photo urls and titles?)
            }
        });

        console.log('Flickr content coming soon'); // browser output
    }
});

server.route({
    method: 'GET',
    path: '/google',
    handler: function (request, reply) {
        var httpRequest = require('request');

        httpRequest('http://www.google.com', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                reply(body); // Show the HTML for the Google homepage in CLI (cmd line interface)
                console.log('CLI'); // browser output
            }
        });
    }
});

server.route({
    method: 'GET',
    path: '/hello',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/twitter',
    handler: function (request, reply) {
        var Twit = require('twit'),
            secrets = require("./src/js/secrets.js");

        var T = new Twit(secrets.twitter);

        T.get('statuses/user_timeline', {screen_name: 'vanarts'}, function (err, data, response) {
            reply({"tweets": data})
        })
    }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});