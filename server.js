var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ZineModel = require('./models/zine');
var LibraryModel = require('./models/library');
var app = express();
var port = process.env.PORT || 8081;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
   app.listen(port, () => {
     console.log('listening on port' + port);
   });
});

//connect to mongoose w/ hosted db
mongoose.connect(process.env.MONGO_URL);


// set up headers for our server
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();
router.use(function(req, res, next) {
  next();
});

router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

  router.route('/zines')
    .get(function(req,res){

      if (req.query.tags === undefined) {
        req.query.tags = '';
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
    }).limit();
      // limits the number of results sent back immediately
    });


// route: /zines/:zine_id

router.route('/zines/:zine_id')
  .get(function(req, res) {
    ZineModel.findById(req.params.zine_id).populate('libraries').exec(function(err, docs) {
      if (err)
      res.send(err);
      console.log("Found zine");
      console.log(docs.libraries.name);
      res.json({zine: docs, libraries: {library:docs.libraries}});
    });
  })

  .put(function(req, res) {
    ZineModel.findById(req.params.zine_id, function(err, zine) {
      if (err)
        res.send(err);
      // if no err
      console.log("The zine you've found"+ zine);

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
      });
    });
  });


  // on routes that end in /libraries
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
      res.send({library:docs});
    }
  });
});

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
      var keys = Object.keys(req.body.library);
      for (var i=0; i < keys.length; i++) {
        var key = keys[i];
        library[key] = req.body.library[key];
      }
      library.save(function(err) {
        if (err)
          res.send(err);
        res.json(library);
      });
    });
  });


// all of our routes will be prefixed with /api
app.use('/api', router);


