var cwd = require("file").cwd;

var currentPaths = require.loader.getPaths();
var newPaths = [cwd()].concat(currentPaths);
require.loader.setPaths(newPaths);

var command = require("getjs/command");

command.run(system.args);