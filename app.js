var index = require('./routes/index');
var blog = require('./routes/blog');
var user = require('./routes/user');
var settings = require('./routes/settings');
var comm = require('./controller/comm');
var express = require('express');
var path = require('path');
var Loader = require('loader');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); 
var errorhandler = require('errorhandler');
var config = require('./config');
var _ = require('lodash');

var app = express();

// all environments

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
app.locals._layoutFile = 'layout.html';


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 设置 Cookie
app.use(cookieParser('nodeBlog_'));
app.use(express.static(path.join(__dirname, 'public')));

// set static, dynamic helpers
_.extend(app.locals, {
  config: config,
  //Loader: Loader
});

//middileware 用户认证
app.use(comm.auth);

//公用加载
app.use(comm.datasource);

app.use(index);
app.use('/user', user);
app.use('/settings', settings);
app.use('/blog', blog);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
if (config.debug) {
  app.use(errorhandler());
} else {
  app.use(function (err, req, res, next) {
    console.error('server 500 error:', err);
    return res.status(500).send('500 status');
  });
}

module.exports = app;