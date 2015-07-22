var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 3000 });


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
    path: '/hello',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});