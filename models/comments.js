var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CommentsSchema = new Schema({
  blog_id : {type : String},
  author : {type : String}, 
  comment_date : {type : Date, default: Date.now},
  comment_content : {type: String}
});

mongoose.model('Comments', CommentsSchema);