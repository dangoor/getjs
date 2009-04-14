var cwd = require("file").cwd;

var currentPaths = require.loader.getPaths();
var newPaths = [cwd()].concat(currentPaths);
require.loader.setPaths(newPaths);

var command = require("getjs/command");

// XXX this will become a "system" require
require("environment");
var args = ARGV;

command.run(args);