var Mongo = require('mongodb');
var MongoServer = Mongo.Server;
var MongoDB = Mongo.Db;
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;

var USER = "emcgary";
var PASS = "abcd1234";
var APP = "heroku_app12979061";
var HOST = "ds037518.mongolab.com";
var PORT = 37518;

var address = "mongodb://" + USER + ":" + PASS + "@" + HOST + ":" + PORT + "/" + APP;

module.exports = {
	connect: function(callback) {
		MongoClient.connect(address, function(err, db) {
			if(this.connection) {
				callback(err, this.connection);
				return;
			}
			if (err) {
				callback(err, db);
				return;
			}
			var connection = this.connection = db;
			callback(undefined, connection);
		});
	},
	insert: function(name, doc) {
		this.connect(function(err, db) {
			if (err) throw err;
			var collection = db.collection(name);
			collection.insert(doc, function(err, db) {
				if (err) throw err;
				console.log(db);
			});
		});
	}
};