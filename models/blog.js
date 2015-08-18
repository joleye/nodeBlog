var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var utility = require('utility');

var BlogSchema = new Schema({
  title: { type : String},
  content: { type : String},
  content_html : {type : String},
  post_time : {type : Date, default: Date.now},
  author : {type : String},
  reply_count: { type: Number, default: 0 },
  visit_count: { type: Number, default: 0 },
  collect_count: { type: Number, default: 0 }
});

mongoose.model('Blog', BlogSchema);