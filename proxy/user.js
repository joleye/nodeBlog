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

/**
* 读取用户信息
* username 用户名
*/
exports.getUserByName = function(username, callback){
	User.findOne({username : username}, function(err, docs){
		return callback(err, docs);
	});
}

var makeGravatar = function (email) {
  return 'http://www.gravatar.com/avatar/' + utility.md5(email.toLowerCase()) + '?size=48';
};
exports.makeGravatar = makeGravatar;

exports.getGravatar = function (user) {
  return user.avatar || makeGravatar(user.email);
};