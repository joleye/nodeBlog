var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db, {useNewUrlParser: true, useUnifiedTopology: true}, function (err) {
    if (err) {
        console.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }
});

require('./blog');
require('./user');
require('./tag');
require('./comments');

exports.Blog = mongoose.model('Blog');
exports.User = mongoose.model('User');
exports.Tag = mongoose.model('Tag');
exports.Comments = mongoose.model('Comments');
