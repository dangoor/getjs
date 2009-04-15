var log = require("getjs/logger").log;
var commands = require("getjs/commands");

exports.run = function(args) {
    log.info("getjs - you got it.");
    var command = args.shift();
    var command_obj = new commands[command](args);
    command_obj.run();
}
