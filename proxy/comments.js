var models = require('../models');
var Comments = models.Comments;
var utility = require('utility');

/**
  *   回复列表
  */
exports.getQueryList = function(param, opt, callback){
	var fields = [];
	if(opt.fields){
		fields = opt.fields;
	}
	Comments.find(param,fields,opt,function(err,docs){
		if (err) {
		      return callback(err);
		 }
		 if (docs.length === 0) {
		     return callback(null, []);
		 }

		 callback(null, docs);
	});
};

/**
 *    删除
 */
exports.remove = function(blog_id, callback){
	Comments.remove({blog_id : blog_id}, callback);
}