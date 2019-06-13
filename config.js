/**/


var config = {
    debug: true,
    level: 'info',//日志级别 info debug warn error
    appenders: ['file', 'out'],//日志输出类型
    // mongodb 配置
    db: 'mongodb://blog:123456@localhost:27017/node_blog_db?authMode=scram-sha1',
    page_size: 15,
    // 程序运行的端口
    port: 3000,
    site_name : 'nodBlog'
}

module.exports = config;