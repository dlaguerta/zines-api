var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ZineModel = require('./models/zine');
var LibraryModel = require('./models/library');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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


// var zineSchema = new mongoose.Schema({
//   title: 'string',
//   creator: 'string'
//
// });

// var ZineModel = mongoose.model('zine',zineSchema);


/////api routes using router

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('router in use');
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

// route for all zines in collection
// router.route('/zines')
  // .get(function(req,res){
  //   // res.json({ querystring_title: req.query.title });
  //   if (req.query.title === undefined) {
  //     req.query.title = '';
  //   }
  //   ZineModel.find({ "title": { "$regex": req.query.title, "$options": "i" }},function(err,docs) {
  //     if(err) {
  //       res.send({error:err});
  //     }
  //     else {
  //       console.log('Successful send of zines');
  //       res.send({zine:docs});
  //     }
  //   });
  // });
  router.route('/zines')
    .get(function(req,res){
      // res.json({ querystring_title: req.query.title });
      if (req.query.tags === undefined) {
        req.query.tags = '';
      }
      ZineModel.find({ "tags": { "$regex": req.query.tags, "$options": "i" }},function(err,docs) {
        if(err) {
          res.send({error:err});
        }
        else {
          console.log('Successful send of zines');
          res.send({zine:docs});
        }
      });
    });


// on routes that end in /zines/:zine_id
// ----------------------------------------------------
router.route('/zines/:zine_id')

  .get(function(req, res) {
    ZineModel.findById(req.params.zine_id, function(err, zine) {
      if (err)
      res.send(err);
      res.json(zine);
    });
  })

  .put(function(req, res) {
    ZineModel.findById(req.params.zine_id, function(err, zine) {
      if (err)
        res.send(err);
      // if no err
      console.log(zine);
      zine.title = req.body.title;
      //save the zine
      zine.save(function(err) {
        if (err)
          res.send(err);
        res.json({ message: 'Zine updated!' });
      });
    });
  });


  // on routes that end in /libraries
  // ----------------------------------------------------
router.route('/libraries')
.get(function(req, res) {
  if (req.query.name === undefined) {
    req.query.name = '';
  }
  LibraryModel.find({ "name": { "$regex": req.query.name, "$options": "i" }},function(err,docs) {
    if(err) {
      res.send({error:err});
    }
    else {
      console.log('Successful send of libraries');
      res.send({library:docs});
    }
  });
});

//get a library by id
router.route('/libraries/:library_id')

  .get(function(req, res) {
    LibraryModel.findById(req.params.library_id, function(err, library) {
      if (err)
      res.send(err);
      res.json(library);
    });
  })

  .put(function(req, res) {
    LibraryModel.findById(req.params.library_id, function(err, library) {
      if (err)
        res.send(err);
      console.log("the info:" + library);

      for (var prop in req.body) {
      library[prop] = req.body[prop];
      }

      library.save(function(err) {
        if (err)
          res.send(err);
        res.json(library);
      });
    });
  });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

//////old api route examples
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

