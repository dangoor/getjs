var cwd = require("file").cwd;

var currentPaths = require.loader.getPaths();
var newPaths = [cwd()].concat(currentPaths);
require.loader.setPaths(newPaths);

var main = require("getjs/main");

main.run(system.args);