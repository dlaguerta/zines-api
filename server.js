var express = require('express');
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/emberZines');


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


//routes

app.get('/api/',function(req,res) {
	res.send('Working');
});

app.listen('4500');

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