let log4js = require("log4js");

exports.getLogger = function(file_name) {
    return log4js.getLogger(exports.getFileName(file_name));
};

exports.getFileName = function(path){
    var paths = path.split(/\/|\\/);
    return paths[paths.length -1];
};