
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , blog = require('./controller/blog')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments

console.log(process.env.PORT)

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use('/public', express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

console.log(routes);

//列表
app.get('/', blog.list);
app.get('/blog', blog.list);
app.get('/blog/:id', blog.detail);
app.post('/blog/remove/:id', blog.remove);
app.get('/note', blog.list);

//关于
//app.get('/about', about.me);

//内容查看
//app.get('/detail', blog.detail);

//用户信息
//app.get('/users', users.list);
//app.get('/proinfo', users.proinfo);

//内容编辑
app.get('/post', blog.post);
app.post('/post', blog.postSave);
app.get('/blog/edit/:id',blog.edit);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
