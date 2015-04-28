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

exports.getBlogById = function(blogId, callback){
	Blog.findOne({_id : blogId},function(docs,arg1){
		return callback(docs,arg1);
	});
}

/**
  *   保存
  */
exports.save = function(title, content, callback){
	var blog = new Blog();
	blog.title = title;
	blog.content = content;
	blog.save(callback);
}

exports.remove = function(blog_id, callback){
	Blog.remove({_id : blog_id}, callback);
}