// requires
var fs = require('fs');
var express = require('express');
var http = require('http');
var path = require('path');

// create express app
var app = express();

// configuration
app.configure(function() {
	app.set('port', process.env.PORT || 8889);
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(app.router);
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(express.logger('dev'));
	app.use(express.static(path.join(__dirname, 'static')));
});

app.configure('development', function() {
	app.use(express.errorHandler());
});

// routes
app.get('/', function(req, res) {
	res.render("index.ejs");
});

// start
http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});