var mongoose = require('mongoose'), Schema = mongoose.Schema;

var zineSchema = new mongoose.Schema({
  title: 'string',
  creator: 'string',
  library_id: [{ type: Schema.Types.ObjectId, ref: 'library' }]

});

module.exports = mongoose.model('zine',zineSchema);