var express = require('express');
var router = express.Router();
var user = require('../proxy').User;
var blog = require('../proxy').Blog;
var utility = require('utility');
var models = require('../models');
var UserModel = models.User;
var FormatHelper = require('../common/FormatHelper');
var Pagination = require('../common/Pagination');
var config = require('../config');

/*显示blog文章*/
router.get('/blog' , function(req, res){
	display_blog_list(req, res, {});
});

router.get('/' , function(req, res){
	res.redirect('/blog');
});

router.get('/tag/:key', function(req, res){
	var key = req.params.key;
	if(key){
		var pat=new RegExp(key);
		var opt = {
			tag : pat
		};
		display_blog_list(req, res, opt);
	}else{
		res.render("notify",{status : false, msg : '没有找到分类'});
	}
});

function display_blog_list(req, res, opt){
	var page = req.query.page ? parseInt(req.query.page) : 1;
	var start = page > 1 ? (page -1) * config.pagesize : 0;

	blog.getQueryList(opt, {skip : start, limit : config.pagesize, sort: {post_time : -1}},function(err, list){
		for(var i=0;i<list.length;i++){
			list[i].post_time_friendly = FormatHelper.format_date(list[i].post_time,true);
			list[i].content_html_head = FormatHelper.format_body_head(list[i].content_html, config.listBlogFontLen);
		}
		blog.getQueryListCount(opt, function(err, count){
			res.render('blog', {
				page : Pagination.get('?page={1}', page, config.pagesize, count),
				blogs : list
			});
		});
	});
}

router.get('/signin' , function(req, res){
  	res.render("login",{returl : req.query.returl});
});

router.post('/signin' , function(req, res){
	var username = req.body.username;
	var pwd = req.body.password;
	var remember = req.body['remember-password'];
	var returl = req.body.returl;
	var info = user.getUserByName(username, function(err, docs){
		if(docs == null){
			return res.json({status : false, msg : '用户名不存在! '});
		}else if(docs.password == utility.md5(pwd)){
			//req.session.current_user = docs;
			if(remember == 1){
				res.cookie('user',username, {maxAge : 60*60*24*365*10*1000});	
			}else{
				res.cookie('user',username);
			}
			return res.json({status : true, msg : '登录成功',returl : returl});
		}else{
			return res.json({status : false, msg : '密码错误'});
		}
	});
});

router.get('/signup' , function(req, res){
	res.render("register",{});
});

router.post('/signup' , function(req, res){
	if(req.body.password != req.body.repassword){
		res.json({status : false, msg : '两次输入的密码不同!'})
	}else{
		var param = {
			email : req.body.email,
			password : utility.md5(req.body.password)
		};

		user.getUserByName(param.email, function(err, docs){
			if(docs != null){
				res.json({status : false, msg : '邮箱已经注册! '});
			}else{
				user.save(param,function(err){
					if(!err){
						res.json({status : true, msg : '注册成功'});
					}else{
						res.json({status : false, msg : '注册失败,'+err});
					}

				});
			}
		});

		
	}
});

router.get('/signout' , function(req, res){
	res.cookie('user','');
	var ret_url = req.query.ret_url;

	res.redirect(ret_url);
});

router.get('/password_reset' , function(req, res){
  	res.render("password_reset",{});
});

module.exports = router;