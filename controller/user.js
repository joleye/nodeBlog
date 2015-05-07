var user = require('../proxy').User;
/*
 * GET users listing.
 */

exports.user = function(req, res){
  	res.send("respond with a resource");
};


exports.login = function(req, res){
  	res.render("login",{});
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
			password : req.body.password
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
