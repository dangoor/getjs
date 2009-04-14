var BaseLogger = require("logger").Logger;

var Logger = exports.Logger = function() {
    
};

Logger.prototype = new BaseLogger(system.stdout);

Logger.prototype.info = function() {
    return this.add(Logger.INFO, arguments[0]);
}

var log = exports.log = new Logger();
