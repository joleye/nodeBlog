/**/


var config = {
	debug : true, 
	sitename : 'nodeBlogDev',
	// mongodb 配置
	//db : 'mongodb://112.74.94.69:10001/node_blog_dev',
	db : 'mongodb://localhost:27017/node_blog_dev',
  	port: 3000,// 程序运行的端口
  	pagesize : 8, //列表文章条数
  	topBlogsSize : 8, //推荐文章条数
  	listBlogFontLen : 400 //列表文字数量
}

module.exports = config;