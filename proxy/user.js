var models = require('../models');
var User = models.User;


/**
  *    保存
  */
exports.save = function(info, callback){
	var user = new User();
	user.username = info.email;
	user.email = info.email;
	user.password = info.password;
	user.save(callback);
}