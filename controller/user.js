
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

  	res.send("register",{});
};

exports.password_reset = function(req, res){
  	res.render("password_reset",{});
};
