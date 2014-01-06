var _ = require('underscore');
var assert = require('assert');
var path = require('path');
var step = require('step');
var express = require('express');
var thrift = require('thrift');
var Int64 = require('node-int64');

var SandboxService = require('./gen-nodejs/SandboxService');
var service_types = require('./gen-nodejs/service_types');

process.on('uncaughtException', function(error) {
    console.error(error);
    process.exit(1);
});

var connection = thrift.createConnection('localhost', process.env.SERVICE_PORT || 9090);

connection.on('error', function(error) {
    console.error(error);
    console.error('Thrift connection error. Check whether the backend server is running.');
    process.exit(1);
});

process.on('SIGINT', function() {
    console.log('Closing connection.');
    connection.end();
    console.log('Closing connection: Done.');
    process.exit(0);
});

var client = thrift.createClient(SandboxService, connection);

var app = express();
app.use(express.bodyParser());

app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', function(request, response) {
    response.writeHead(302, {
        Location: '/static/form.html'
    });
    response.end();
});

// "Message" posting logic. Proxies messages post via the frontend to the backend.
app.post('/', function(request, response) {
    var e = request.body;
    step(
        function() {
            var self = this;
            if (_.isObject(e) && _.isString(e.user) && e.user !== '' && _.isString(e.message) && e.message !== '') {
                console.log('POST: ' + e.user + ': ' + e.message);
                var message = new service_types.MessageToPost();
                message.ms = new Int64(Date.now());
                message.user = e.user;
                message.message = e.message;
                client.post_message(message, function(error, data) {
                    if (error) {
                        console.log(error);
                        process.exit(1);
                    } else {
                        console.log('SENT: ' + e.user + ': ' + e.message);
                        self();
                    }
                });
            } else {
                self();
            }
        },
        function() {
            response.writeHead(302, {
                Location: '/'
            });
            response.end();
        });
});

// Expose each Thrift "api_"-prefixed RPC as an endpoint.
var prefix_rpc = 'api_';
var prefix_url = '/api/';
_.each(_.functions(client), function(name) {
    if (name.substr(0, prefix_rpc.length) === prefix_rpc) {
        app.get(prefix_url + name.substr(prefix_rpc.length), function(request, response) {
            var result = {};
            step(
                function() {
                    var self = this;
                    client[name](function(error, data) {
                        if (error) {
                            console.log(error);
                            process.exit(1);
                        } else {
                            result = data;
                            self();
                        }
                    });
                },
                function() {
                    response.format({
                        text: function() {
                            response.send(JSON.stringify(result));
                        },
                        html: function() {
                            // Populate each endpoint URL with an corresponding HTML tag for easier browsing.
                            function dfs(o) {
                                for (var i in o) {
                                    if (o.hasOwnProperty(i)) {
                                        if (_.isString(o[i])) {
                                            if (o[i].substr(0, prefix_url.length) == prefix_url) {
                                                o[i] = '<a href=\'' + o[i] + '\'>' + o[i] + '</a>';
                                            }
                                        } else if (_.isObject(o[i])) {
                                            dfs(o[i]);
                                        }
                                    }
                                }
                            };
                            dfs(result);
                            response.send('<pre>' + JSON.stringify(result, null, 2) + '</pre>');
                        },
                    });
                });
        });
    }
});

app.listen(process.env.PORT || 3000);
