var user = require('../proxy').User;
var blog = require('../proxy').Blog;
var Blog = require('../models').Blog;
var Tag = require('../models').Tag;
var config = require('../config');
var FormatHelper = require('../common/FormatHelper');

exports.datasource = function(req, res, next){
	blog.getQueryList({}, {skip : 0, limit : config.topBlogsSize, fields : ['title', '_id']}, function(err, list){
		res.locals.topBlogs = list;
		next();
	});

	Tag.find({}, {}, {sort: {count : -1}}, function(err, docs){
		res.locals.catelogs = docs;
	});
};

exports.auth = function(req, res, next){
	var member_url = ['/settings/*','/post','/blog/edit/*','/blog/remove/*'];
	var username = res.locals.current_user = typeof req.cookies != 'undefined' &&  req.cookies['user'] != ''?  req.cookies['user'] : undefined;
	if(username){
		user.getUserByName(username, function(err, docs){
			res.locals.current_realname = docs.realname;
			next();
		});
	}else{
		var url = req.originalUrl;
		if (check_filter(member_url,url)){
			return res.redirect("/signin?returl="+url);
		}
		next();
	}
};

function check_filter(arrs, url){
	for(var i = 0; i< arrs.length; i++){
		var reg = new RegExp('^'+arrs[i],'g');
		if(reg.test(url)){
			return true;
		}
	};
	return false;
}
