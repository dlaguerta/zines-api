var express = require('express');
var mongoose = require('mongoose');

var app = express();

//connect to local db
// mongoose.connect('mongodb://localhost/emberZines');

//connect to hosted db
const MongoClient = require('mongodb').MongoClient;

//require our env and use our env file
var dotenv = require('dotenv');
dotenv.config();

//url with env secrets
var url = process.env.MONGO_URL;
var db;

//connect Mongodb with server at startup
MongoClient.connect(url, (err, database) => {
  if (err) return console.log(err);
   db = database;
   app.listen(4500, () => {
     console.log('listening on port 4500');
   });
});

//connect to mongoose w/ hosted db
mongoose.connect(url);

// app.listen('4500');

// set up headers for our server
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});


var zineSchema = new mongoose.Schema({
	title: 'string',
	creator: 'string'
});

var ZineModel = mongoose.model('zine',zineSchema);


//////api routes

app.get('/api/',function(req,res) {
	res.send('Working');
});


app.get('/api/zines', function(req,res) {
	ZineModel.find({},function(err,docs) {
		if(err) {
			res.send({error:err});
		}
		else {
			res.send({zine:docs});
		}
	});
});