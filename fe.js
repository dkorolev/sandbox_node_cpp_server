var path = require('path');
var express = require('express');

var app = express();

app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res) {
    res.writeHead(302, { Location: '/static/form.html' });
    res.end();
});

app.listen(process.env.PORT || 3000);
