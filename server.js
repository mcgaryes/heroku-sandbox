var fs = require('fs');
var http = require('http');
var path = require('path');
var format = require('util').format;

var express = require('express');
var cloudinary = require('cloudinary');
var _ = require("underscore");
var page = require('webpage').create();

var DataBase = require("./database");

var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;

// ============================================================
// === Cloudinary Functionality ===============================
// ============================================================

cloudinary.config({
	cloud_name: 'hryxjwdpj',
	api_key: '119832957377347',
	api_secret: 'GIwU-MaqKzeBrAV87RWsXnky3bo'
});

// ============================================================
// === MongoDB Functionality ==================================
// ============================================================

DataBase.insert("test", {
	foo: "bar"
});

// ============================================================
// === Express Configuration ==================================
// ============================================================

var app = express();

app.configure('development', function() {
	app.use(express.logger('dev'));
});

app.configure(function() {
	app.set('port', process.env.PORT || 8889);
	app.set('view engine', 'ejs');
	app.use(express.static(path.join(__dirname, 'static')));
	app.use(express.bodyParser());
});

// ============================================================
// === Express Routing ========================================
// ============================================================

app.get('/', function(req, res) {
	res.render("index.ejs");
});

app.get('/upload', function(req, res) {
	res.render("upload.ejs");
});

app.post('/upload', function(req, res, next) {
	stream = cloudinary.uploader.upload_stream(function(result) {
		res.json(201, result);
	}, {
		public_id: req.body.title
	});
	fs.createReadStream(req.files.file.path, {
		encoding: 'binary'
	}).on('data', stream.write).on('end', stream.end);
});

app.get("/render-html", function(req, res) {

	/*
	var childArgs = [path.join(__dirname, './static/render.js')];

	childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
		if (err) console.log(err);
		console.log(stdout);
	});
*/
});

// ============================================================
// === HTTP Server Creation ===================================
// ============================================================

http.createServer(app).listen(app.get('port'), function() {
	console.log("The 'Heroku Sandbox' is running on port " + app.get('port'));
});