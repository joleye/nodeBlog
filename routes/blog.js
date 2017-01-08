var express = require('express');
var router = express.Router();
var blog = require('../proxy').Blog;
var comments = require('../proxy/comments');
var Blog = require('../models').Blog;
var CommentsModel = require('../models').Comments;
var config = require('../config');
var FormatHelper = require('../common/FormatHelper');
var Pagination = require('../common/Pagination');

/*显示blog文章*/

/*发布文章*/
router.get('/post', function(req, res){
	var blog = new Blog();
	blog._id = undefined;
	blog.sidebar = 1;
	res.render('post', blog);
});

/*保存文章*/
router.post('/post', function(req, res){
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
				param.sidebar = 1;
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
				param.sidebar = 1;
				res.render('post', param);
			});
		}
		
	}else{
		param.result = false;
		param.msg = '发布内容不能为空';
		param.sidebar = 1;
		res.render('post', param);
	}
});

function getClientIp(req) {
        return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

/*显示博客内容*/
router.get('/:id', function(req,res){
	var blog_id = req.params.id;
	blog.getBlogById(blog_id,function(err, blog){
		if(!blog){
			res.render('notify',{result : false, msg : '该文章不存在!'})
		}else{
			blog.post_time_friendly = FormatHelper.format_date(blog.post_time,true);

			comments.getQueryList({blog_id : blog._id}, {sort : {comment_date : -1}}, function(err1, comment){
				for(var i=0;i<comment.length;i++){
					comment[i].comment_date_friendly = FormatHelper.format_date(comment[i].comment_date,true);
				}
				blog.comments = comment;
				res.render('blog/detail', blog);	
			});
		}
	});
});

router.post('/:id', function(req, res){
	var comment = new CommentsModel();
	comment.author = res.locals.current_user;
	comment.comment_content = req.body.comment_content;
	comment.blog_id = req.params.id;
	comment.save(function(err, docs){
		if(!err){
			res.json({status : true , msg : '回复成功'});
		}
	});
});

/*编辑博客内容*/
router.get('/edit/:id', function(req, res){
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
});

/*删除博客内容*/
router.post('/edit/remove', function(req, res){
	var blog_id = req.body.id;

	blog.getBlogById(blog_id,function(err1, vo){
		if(vo.author == res.locals.current_user){
			blog.remove(blog_id, function(err){
				//删除评论
				comments.remove(blog_id, function(err1){
					res.json({status : true, msg : '删除成功'});	
				});
			});
		}else{
			res.json({status : false, msg : '只能删除自己发布的文章'});
		};
	});
});

module.exports = router;