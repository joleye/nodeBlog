var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db, function (err) {
  if (err) {
    console.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});


require('./blog');
require('./user');

exports.Blog = mongoose.model('Blog');
exports.User = mongoose.model('User');