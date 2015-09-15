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
	
	var info = user.getUserByName(username, function(err, docs){

		if(docs != null && docs.password == utility.md5(pwd)){

			
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
		res.render('notify',{result : false, msg : '两次输入的密码不同!'})
	}else{
		var param = {
			email : req.body.email,
			password : utility.md5(req.body.password)
		};

		user.save(param,function(err){
			if(!err){
				res.render('notify',{result : true, msg : '注册成功'});
			}else{
				res.render('notify',{result : false, msg : '注册失败,'+err});
			}

		});
	}
	
  	
};

exports.password_reset = function(req, res){
  	res.render("password_reset",{});
};


exports.auth = function(req, res){


	user = res.locals.current_user = req.session.user = '111';//new UserModel(user);

	
};