var models = require('../models');
var Blog = models.Blog;
var Tag = models.Tag;
var utility = require('utility');

/**
  *   博客列表
  */
exports.getQueryList = function(param, opt, callback){
	var fields = ['_id','title','post_time','content_html','visit_count','reply_count','author'];
	if(opt.fields){
		fields = opt.fields;
	}
	Blog.find(param,fields,opt,function(err,docs){
		if (err) {
		      return callback(err);
		 }
		 if (docs.length === 0) {
		     return callback(null, []);
		 }

		 callback(null, docs);
	});
};


exports.getQueryListCount = function(param, callback){
	Blog.count(param, callback);
};

exports.getBlogById = function(blog_id, callback){
	Blog.findOne({_id : blog_id},function(err,docs){
		if(!err && docs)
			Blog.update({_id: blog_id},{visit_count : docs.visit_count + 1},{},function(err1,docs1){});
		
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
	blog.content_html = info.content_html;
	blog.author = info.author;
	blog.tag = info.tag;
	blog.save(function(err, docs){
		saveOrUpdateTag(info.tag);
		callback(err, docs);
	});
}

/*标签保存*/
function saveOrUpdateTag(str, index, is_update){
	var tags = str.split(' ');
	if(tags){
		if(typeof index == 'undefined'){
			index = 0;
		}
		if(tags.length == 0 || tags.length <= index){
			return;
		}
		var tag = tags[index];
		Tag.findOne({tag_name : tag}, function(err, doc){
			if(tag){
				if(!err && doc == null){
					var m = new Tag();
					m.tag_name = tag;
					m.count = 1;
					m.save(function(){
						console.log('tag save success.');
					});
				}else{
					var pat = new RegExp(tag);
					Blog.count({tag : pat}, function(err, count){
						if(count > 0){
							Tag.update({tag_name : tag}, {count : count}, {}, function(){
								console.log('tag update success.');
							});
						}else{
							Tag.remove({tag_name : tag}, function(err2){
								console.log('tag delete success');
							});
						}
					});
				}
			}
			saveOrUpdateTag(str, index+1, is_update);
		});
	}
}

/**
 *    修改文章
 */
exports.update = function(blog_id,info,callback){
	var blog = {};
	blog.title = info.title;
	blog.content = info.content;
	blog.content_html = info.content_html;
	blog.tag = info.tag;
	blog.author = info.author;
	Blog.update({_id:blog_id},blog,{},function(err, docs){
		saveOrUpdateTag(info.tag);
		callback(err, docs);	
	});		
}

/**
 *    删除
 */
exports.remove = function(blog_id, callback){
	Blog.findOne({_id : blog_id},function(err,docs){
		if(!err && docs)
			saveOrUpdateTag(docs.tag);
		
		Blog.remove({_id : blog_id}, callback);
	});
}