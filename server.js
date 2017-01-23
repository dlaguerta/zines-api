var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ZineModel = require('./models/zine');
var LibraryModel = require('./models/library');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//connect to local db
// mongoose.connect('mongodb://localhost/emberZines');
// app.listen('4500');


// //connect to hosted db
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


// set up headers for our server
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});


/////api routes using router

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  // console.log('router in use');
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

  router.route('/zines')
    .get(function(req,res){
      // res.json({ querystring_title: req.query.title });
    //   let queryOptions = {
    //     pagelimit: req.query.limit || 10
    // };
      if (req.query.tags === undefined) {
        req.query.tags = '';
      }

      if (req.query.limit) {
        console.log("limit is:  " + req.query.limit);
        var limit = req.query.limit;
        // queryOptions.offset = (options.page - 1) * queryOptions.limit
      }
      ZineModel.find({ "tags": { "$regex": req.query.tags, "$options": "i",  }},function(err,docs) {
        if(err) {
          res.send({error:err});
        }
        else {
          console.log('Successful send of zines from get route');
          res.send({meta: {total:docs.length}, zine:docs});
        }
      // });
    }).limit(50);
      // limits the number of results sent back immediately
    });


// on routes that end in /zines/:zine_id
// ----------------------------------------------------
router.route('/zines/:zine_id')

  .get(function(req, res) {
    ZineModel.findById(req.params.zine_id, function(err, docs) {
      if (err)
      res.send(err);
      console.log("Found zine");
      res.json({zine: docs});
    });
  })

  .put(function(req, res) {
    ZineModel.findById(req.params.zine_id, function(err, zine) {
      if (err)
        res.send(err);
      // if no err
      console.log("The zine you've found"+ zine);
      // console.log(Object.keys(req.body.zine));

      var keys = Object.keys(req.body.zine);
      for (var i=0; i < keys.length; i++) {
        var key = keys[i];
        zine[key] = req.body.zine[key];
      }
      //save the zine
      zine.save(function(err) {
        if (err)
          res.send("error message" + err);
        res.json(zine);
        console.log("***saved the zine from form***");
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
      console.log('Successful send of libraries from get route');
      res.send({library:docs});
    }
  });
});

//get a library by id
router.route('/libraries/:library_id')

  .get(function(req, res) {
    LibraryModel.findById(req.params.library_id, function(err, docs) {
      if (err)
      res.send(err);
      res.json({library:docs});
    });
  })

  .put(function(req, res) {
    LibraryModel.findById(req.params.library_id, function(err, library) {
      if (err)
        res.send(err);
      console.log("the library info you're changing:" + library);
      console.log(Object.keys(req.body.library));
      console.log(req.body.library.name);
      var keys = Object.keys(req.body.library);
      for (var i=0; i < keys.length; i++) {
        var key = keys[i];
        library[key] = req.body.library[key];
      }
      console.log(library);
      library.save(function(err) {
        if (err)
          res.send(err);
        res.json(library);
        console.log('*******saved the library********');
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

