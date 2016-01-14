var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type : String},
  password: { type : String},
  gender : {type : Number, default: 1},
  realname : {type : String},
  office : {type : String},
  group_id : {type : Number, default : 0},
  register_time: { type: Date, default: Date.now },
  email: { type: String, default: 0 },
  login_count: { type: Number, default: 0 },
  lastlogin_time: { type: Date, default: Date.now }
});

mongoose.model('User', UserSchema);