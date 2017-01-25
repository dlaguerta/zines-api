var mongoose = require('mongoose'), Schema = mongoose.Schema;
var zine = require('./zine');
var librarySchema = Schema({
  name        : String,
  city        : String,
  state       : String,
  photo       : String,
  circulation : Boolean,
  url         : String,
  _zine   : {type: Number, ref: 'zine'}
});

module.exports = mongoose.model('library',librarySchema);