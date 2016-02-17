var blog = require('../proxy').Blog;
var Blog = require('../models').Blog;
var config = require('../config');
var FormatHelper = require('../common/FormatHelper');

exports.datasource = function(req, res, next){
	blog.getQueryList({}, {skip : 0, limit : config.topBlogsSize, fields : ['title', '_id']}, function(err, list){
		res.locals.topBlogs = list;
		res.locals.catelogs = [{tagName : '啊啊啊', blogCnt : 444},{tagName : '啊啊啊', blogCnt : 54}];
		next();
	});
};