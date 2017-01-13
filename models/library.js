var mongoose = require('mongoose'), Schema = mongoose.Schema;

var librarySchema = Schema({
  name    : String,
  city    : String,
  state   : String
});

module.exports = mongoose.model('library',librarySchema);