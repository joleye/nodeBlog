var blog = require('../proxy').Blog;
var Blog = require('../models').Blog;
var config = require('../config');
var FormatHelper = require('../common/FormatHelper');
var Pagination = require('../common/Pagination');

exports.list = function(req, res){
	var page = req.query.page ? parseInt(req.query.page) : 1;
	var start = page > 1 ? (page -1) * config.pagesize : 0;

	blog.getQueryList({}, {skip : start, limit : config.pagesize, sort: {post_time : -1}},function(err, list){
		for(var i=0;i<list.length;i++){
			list[i].post_time_friendly = FormatHelper.format_date(list[i].post_time,true);
			list[i].content_html_head = FormatHelper.format_body_head(list[i].content_html, config.listBlogFontLen);
		}

		blog.getQueryListCount({}, function(err, count){
			res.render('blog', {
				page : Pagination.get('?page={1}', page, config.pagesize, count),
				blogs : list
			});
		});
	});

};

function getClientIp(req) {
        return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
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
	blog.sidebar = 1;
	res.render('post', blog);
};

exports.postSave = function(req, res){
	var param = {
		title :  req.body.title,
		content : req.body['content-markdown-doc'],
		content_html : req.body['content-html-code'],
		tag : req.body.tag,
		author : res.locals.current_user
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
			blog.sidebar = 1;
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
