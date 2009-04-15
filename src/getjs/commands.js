var file = require("file");
var log = require("getjs/logger").log;

var Command = function() {
    
}

Command.run = function() {
    // no op
}

var init = exports.init = function(args) {
}

init.prototype.run = function() {
    log.info("Initializing working environment");
}