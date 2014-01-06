var _ = require('underscore');
var path = require('path');
var step = require('step');
var express = require('express');
var thrift = require('thrift');
var Int64 = require('node-int64');

var SandboxService = require('./gen-nodejs/SandboxService');
var service_types = require('./gen-nodejs/service_types');

var connection = thrift.createConnection('localhost', process.env.SERVICE_PORT || 9090);

connection.on('error', function(error) {
    console.error(error);
    console.error('Thrift connection error. Check whether the backend server is running.');
    process.exit(1);
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

app.post('/', function(request, response) {
    var e = request.body;
    step(
        function() {
            var self = this;
            if (_.isString(e.user) && e.user !== '' && _.isString(e.message) && e.message !== '') {
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

app.listen(process.env.PORT || 3000);
