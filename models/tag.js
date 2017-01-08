var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TagSchema = new Schema({
  tag_name: { type : String},
  post_time : {type : Date, default: Date.now},
  count: { type: Number, default: 0 },
  blog_ids : {type: String}
});

mongoose.model('Tag', TagSchema);