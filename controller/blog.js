var blog = require('../proxy').Blog;
var Blog = require('../models').Blog;
var FormatHelper = require('../common/FormatHelper');

exports.list = function(req, res){

	blog.getQueryList({}, {},function(err, list){

		for(var i=0;i<list.length;i++){
			list[i].post_time_friendly = FormatHelper.format_date(list[i].post_time,true);
			list[i].content_html_head = FormatHelper.format_body_head(list[i].content_html);
		}

		res.render('blog', {
			blogs : list 
		});
	});

};

/*显示博客内容*/
exports.detail = function(req,res){
	var blog_id = req.params.id;

	blog.getBlogById(blog_id,function(err, blog){
		if(!blog){
			res.render('notify',{result : false, msg : '该文章不存在!'})
		}else{
			blog.post_time_friendly = FormatHelper.format_date(blog.post_time,true);

			res.render('blog/detail', blog);
		}
	});
};

exports.post = function(req, res){
	var blog = new Blog();
	blog._id = undefined;
	res.render('post', blog);
};

exports.postSave = function(req, res){
	var param = {
		title :  req.body.title,
		content : req.body['content-markdown-doc'],
		content_html : req.body['content-html-code']
	};

	if(param.title != '' && param.content != ''){
		var blog_id = req.body.blog_id;
		param._id = blog_id;

		if(blog_id){
			blog.update(blog_id,param,function(err){
				if(err){
					param.result = false;
					param.msg = err;
				}else{
					param.result = true;
					param.msg = '修改成功';
				}
				res.render('post', param);
			});
		}else{
			blog.save(param, function(err){
				if(err){
					param.result = false;
					param.msg = err;
				}else{
					param.result = true;
					param.msg = '发布成功';	
				}
				res.render('post', param);
			});
		}
		
	}else{
		param.result = false;
		param.msg = '发布内容不能为空';
		res.render('post', param);
	}
};

/*编辑博客内容*/
exports.edit = function(req, res){
	var blog_id = req.params.id;
	if(!blog_id){
		res.render('notify',{result : false , msg : '没有找到该文章! '});
	}else{
		blog.getBlogById(blog_id,function(err, blog){
		if(!blog){
			res.render('notify',{result : false, msg : '该文章不存在!'})
		}else
			res.render('post', blog);
		});
	}
};

/*删除博客内容*/
exports.remove = function(req, res){
	var blog_id = req.params.id;
	blog.remove(blog_id,function(err){
		res.send('notify',{msg : '删除成功'});
	});
}
