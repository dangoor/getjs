var file = require("file");
var log = require("getjs/logger").log;
var WorkingEnv = require("getjs/workingenv").WorkingEnv;

var Command = function() {
    
}

Command.run = function() {
    // no op
}

var init = exports.init = function(args) {
    var directory = args[0];
    if (!directory) {
        directory = file.cwd();
    }
    this.directory = directory;
}

init.prototype = {
    description: "Initialize a new JavaScript environment.",
    getWorkingEnv: function() {
        return new WorkingEnv(this.directory);
    },
    run: function() {
        log.info("Initializing working environment");
    }
}

var help = exports.help = function(args) {
    
}

help.prototype = {
    description: "List the commands",
    run: function() {
        log.info("The following commands are available:\n")
        for (var cmd in exports) {
            var description = exports[cmd].prototype.description;
            log.info(cmd + " - " + description);
        }
    }
}
