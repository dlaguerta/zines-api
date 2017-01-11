var express = require('express');
var mongoose = require('mongoose');

var app = express();

//connect to local db
mongoose.connect('mongodb://localhost/emberZines');
app.listen('4500');


// // //connect to hosted db
// const MongoClient = require('mongodb').MongoClient;
//
// //require our env and use our env file
// var dotenv = require('dotenv');
// dotenv.config();
//
// //url with env secrets
// var url = process.env.MONGO_URL;
// var db;
//
// //connect Mongodb with server at startup
// MongoClient.connect(url, (err, database) => {
//   if (err) return console.log(err);
//    db = database;
//    app.listen(4500, () => {
//      console.log('listening on port 4500');
//    });
// });
//
// //connect to mongoose w/ hosted db
// mongoose.connect(url);


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


/////api routes using router

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here
router.route('/zines')
  .get(function(req,res){
	   ZineModel.find({},function(err,docs) {
		     if(err) {
			        res.send({error:err});
		        }
		      else {
			        res.send({zine:docs});
		          }
	});
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);



//////api routes :working as is
// app.get('/api/',function(req,res) {
// 	res.send('Working');
// });
//
//
// app.get('/api/zines', function(req,res) {
// 	ZineModel.find({},function(err,docs) {
// 		if(err) {
// 			res.send({error:err});
// 		}
// 		else {
// 			res.send({zine:docs});
// 		}
// 	});
// });

// app.get('/api/zines/:id', function(req, res){
//   Zine
// });

// this.get('/api/zines', function(db, request) {
//   if(request.queryParams.title !== undefined) {
//     let filteredZines = zines.filter(function(i) {
//       return i.attributes.zine.toLowerCase().indexOf(request.queryParams.zine.toLowerCase()) !== -1;
//     });
//     return { data: filteredZines };
//   } else {
//     return { data: zines };
//   }
// });

