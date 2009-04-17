var log = require("getjs/logger").log;
var commands = require("getjs/commands");
var exc = require("getjs/exc");

exports.run = function(args) {
    if (!args || args.length == 0) {
        args = ["help"];
    }
    var command = args.shift();
    var command_obj = new commands[command](args);
    if (command_obj.getWorkingEnv) {
        var workingEnv = command_obj.getWorkingEnv();
    } else {
        var WorkingEnv = require("getjs/workingenv").WorkingEnv;
        // XXX this should actually work up the directories to find the
        // working env. or maybe use system.prefix
        var cwd = require("file").cwd();
        var workingEnv = new WorkingEnv(cwd);
    }
    command_obj.run(workingEnv);
}
