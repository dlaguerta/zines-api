var mongoose = require('mongoose'), Schema = mongoose.Schema;
var library = require('./library');
var zineSchema = new mongoose.Schema({
  title: 'string',
  creator: 'string',
  sub_title: 'string',
  volume: 'number',
  number: 'number',
  date: 'string',
  circa_date: 'string',
  place_of_publication: 'string',
  tags: 'string',
  contributor: 'string',
  subject_genre: 'string',
  press_house_publisher: 'string',
  library_ids: [{ type: Schema.Types.ObjectId, ref: 'library' }]

});

module.exports = mongoose.model('zine',zineSchema);