var BaseLogger = require("logger").Logger;
var system = require("environment");

var Logger = exports.Logger = function() {
    
};

Logger.prototype = new BaseLogger(STDOUT);

Logger.prototype.info = function() {
    return this.add(Logger.INFO, arguments[0]);
}

var log = exports.log = new Logger();
