var models = require('../models');
var Blog = models.Blog;
var utility = require('utility');

/**
  *   博客列表
  */
exports.getQueryList = function(param, opt, callback){

	Blog.find(param,['_id','title','post_time'],opt,function(err,docs){
		if (err) {
		      return callback(err);
		 }
		 if (docs.length === 0) {
		     return callback(null, []);
		 }

		 callback(null, docs);
	});
};

exports.getBlogById = function(blog_id, callback){
	Blog.findOne({_id : blog_id},function(err,docs){
		Blog.update({_id: blog_id},{visit_count : docs.visit_count + 1},{},function(err1,docs1){

		});
		return callback(err,docs);
	});
}

/**
  *    保存
  */
exports.save = function(info, callback){
	var blog = new Blog();
	blog.title = info.title;
	blog.content = info.content;
	blog.save(callback);
}

/**
 *    修改
 */
exports.update = function(blog_id,info,callback){
	var blog = {};
	blog.title = info.title;
	blog.content = info.content;

	Blog.update({_id:blog_id},blog,{},callback);		
}

exports.remove = function(blog_id, callback){
	Blog.remove({_id : blog_id}, callback);
}