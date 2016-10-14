var express = require('express');
var router = express.Router();
var User = require('../proxy/user');
var models = require('../models');
var UserModel = models.User;
var utility = require('utility');

router.get('/profile', function(req, res){
	var username = res.locals.current_user;
	res.locals.sidebar = 1;

	User.getUserByName(username, function(err, info){
		return res.render('settings/profile',{info: info});	
	});	
});

router.post('/profile', function(req, res){
	var info = {
		realname : req.body.realname,
		office : req.body.office,
		gender : req.body.gender
	}

	var username = res.locals.current_user;

	UserModel.update({'username' : username}, info, {}, function(err, docs){
		if(err){
			res.json({status : false , msg : '保存失败 , '+err});
		}else{
			res.json({status : true , msg : '保存成功'});
		}
	});
});

router.get('/admin', function(req, res){
	var username = res.locals.current_user;
	res.locals.sidebar = 1;

	User.getUserByName(username, function(err, info){
		return res.render('settings/admin',{info: info});	
	});	
});

/*修改密码保存*/
router.post('/admin', function(req, res){
	var username = res.locals.current_user;
	var password = req.body.password;
	var newpassword = req.body.newpassword;
	var renewpassword = req.body.renewpassword;

	if(renewpassword == newpassword){
		User.getUserByName(username, function(err, info){
			if(err){
				res.json({status : false , msg : '用户名不存在'});
			}else if(info.password == utility.md5(password)){
				UserModel.update({username : username}, {password : utility.md5(newpassword)} ,'', function(err,docs){
					if(err){
						res.json({status : false , msg : err});
					}else{
						res.json({status : true , msg : '修改成功'});
					}
				})
			}else{
				res.json({status : false , msg : '旧密码输入错误!'});
			}
		});
	}else{
		res.json({status : false , msg : '两次输入的密码不对应!'});
	}
});

module.exports = router;