let express = require('express');
let path = require('path');
let Loader = require('loader');
let favicon = require('serve-favicon');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let errorhandler = require('errorhandler');
let fs = require('fs');
let FileStreamRotator = require('file-stream-rotator');
let logger = require('morgan');
let config = require('./config');
let index = require('./routes/index');
let blog = require('./routes/blog');
let user = require('./routes/user');
let settings = require('./routes/settings');
let comm = require('./controller/comm');

let _ = require('lodash');

let app = express();

// all environments

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
app.locals._layoutFile = 'layout.html';


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));//控制台打印日志
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// 设置 Cookie
app.use(cookieParser('nodeBlog_'));
app.use(express.static(path.join(__dirname, 'public')));

//logs
let logDirectory = __dirname + '/logs';

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
let accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYY-MM-DD',
    filename: logDirectory + '/access-%DATE%.log',
    frequency: 'daily',
    max_logs: 10,
    verbose: false
});

// setup the logger
logger.format('access', '[:date[iso]] :method :url :status :res[content-length] - :response-time ms');
app.use(logger('access', {stream: accessLogStream}));

// log4js基本使用
let log4js = require('log4js');
log4js.configure({
    appenders: {
        file: {
            type: 'file',
            filename: 'logs/std.log',
            maxLogSize: 20 * 1024 * 1024,//单位是bytes 1024 * 1024 = 1MB
            compress: true,//是否以压缩的形式保存新文件,默认false。如果true，则新增的日志文件会保存在gz的压缩文件内，并且生成后将不被替换，false会被替换掉
            backups: 7,//当文件内容超过文件存储空间时，备份文件的数量
            encoding: 'utf-8',//default "utf-8"，文件的编码
            category: 'log_file',
            numBackups: 5, //keep five backup files,
        },
        dateFile: {
            type: 'dateFile',
            filename: 'logs/std.log',
            pattern: 'yyyy-MM-dd-hh',
            compress: true
        },
        out: {
            type: 'stdout',
            pattern: "%[%5p%] #{.grey} - %m"
        }
    },
    categories: {default: {appenders: config.appenders, level: config.level}}
});

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
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
if (config.debug) {
    app.use(errorhandler());
} else {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        console.error('server 500 error:', err);
        return res.status(500).send('500 status');
    });
}

module.exports = app;