var blog = require('../proxy').Blog;
var Blog = require('../models').Blog;

exports.list = function(req, res){

	blog.getQueryList({}, {},function(err, list){

		res.render('blog', {
			title : 'home-NodeBlog',
			blogs : list 
		});

	});
};

/*显示博客内容*/
exports.detail = function(req,res){
	var blog_id = req.params.id;

	blog.getBlogById(blog_id,function(err, blog){
		if(!blog){
			res.render('notify',{result : false, msg : '该文章不存在!'})
		}else
			res.render('blog/index', blog);
	});
};

exports.post = function(req, res){
  	console.log(req.headers);

  	var blog = new Blog();

  	res.render('post', blog);
};

exports.postSave = function(req, res){

	var param = {
		title :  req.body.title,
		content : req.body.content
	};

	if(param.title != '' && param.content != ''){
		blog.save(param.title, param.content,function(err){
			param.result = true;
			param.msg = '发布成功' + err;
			res.render('post', param);
		});
	}else{
		param.result = false;
		param.msg = '发布内容不能为空';
		res.render('post', param);
	}


	
};

exports.edit = function(req, res){
	var blog_id = req.params.id;
	if(!blog_id){
		res.render('notify',{result : false , msg : '没有找到该文章! '});
	}else{
  		var param = new Blog();

  		res.render('post', param);
	}
};

exports.remove = function(req, res){
	var blog_id = req.params.id;
	blog.remove(blog_id,function(err){
		res.send('notify',{msg : '删除成功'});
	});
}
