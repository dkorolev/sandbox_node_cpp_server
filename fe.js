var _ = require('underscore');
var path = require('path');
var express = require('express');

var app = express();
app.use(express.bodyParser());

app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', function(request, response) {
  response.writeHead(302, { Location: '/static/form.html' });
  response.end();
});

app.post('/', function(request, response) {
  var e = request.body;
  if (_.isString(e.user) && e.user !== '' && _.isString(e.message) && e.message !== '') {
    console.log(e.user + ': ' + e.message);
  }
  response.writeHead(302, { Location: '/' });
  response.end();
});

app.listen(process.env.PORT || 3000);
