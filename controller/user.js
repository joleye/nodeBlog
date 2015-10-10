var user = require('../proxy').User;
var utility = require('utility');
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
/*
 * GET users listing.
 */

exports.user = function(req, res){
  	res.send("respond with a resource");
};

exports.login = function(req, res){
  	res.render("login",{});
};

exports.postLogin = function(req, res){
	var username = req.body.username;
	var pwd = req.body.password;
	var remember = req.body['remember-password'];
	
	var info = user.getUserByName(username, function(err, docs){

		if(docs != null && docs.password == utility.md5(pwd)){
			//req.session.current_user = docs;
			if(remember == 1){
				res.cookie('user',username, {maxAge : 60*60*24*365*10*1000});	
			}else{
				res.cookie('user',username);
			}
			return res.json({status : true, msg : '登录成功'});
		}else{
			return res.json({status : false, msg : '密码错误'});
		}

	});
};

exports.register = function(req, res){
	res.render("register",{});
};

exports.postRegister = function(req, res){
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
};

exports.signout = function(req, res){
	res.cookie('user','');
	var ret_url = req.query.ret_url;

	res.redirect(ret_url);
};

exports.password_reset = function(req, res){
  	res.render("password_reset",{});
};

exports.auth = function(req, res, next){
	var user = res.locals.current_user = typeof req.cookies != 'undefined' &&  req.cookies['user'] != ''?  req.cookies['user'] : undefined;//new UserModel(user);

	next();
};