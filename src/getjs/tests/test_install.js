var file = require("file");

// XXX this is ugly.
var currentPaths = require.loader.getPaths();
var newPaths = [file.cwd()].concat(currentPaths);
require.loader.setPaths(newPaths);

var testing = require("getjs/testing");
var install = require("getjs/install");
var WorkingEnv = require("getjs/workingenv").WorkingEnv;
var log = require("getjs/logger").log;
log.level = 4;

var testdata = new file.Path("testdata");

var recreateTestdata = function() {
    if (!testdata.exists()) {
        log.debug("Creating new directory: " + testdata.path);
        testdata.mkdirs();
    } else {
        log.debug("Recreating directory: " + testdata.path);
        testdata.rmtree();
        testdata.mkdirs();
    }
}

testing.run({
    testInstallPackage: function() {
        var env = new WorkingEnv(testdata);
        env.clearRepositories();
        env.addRepository("getjs/tests/packages/index.json");
        var installer = new install.Installer(env);
        installer.install("skewer");
        
        var packfile = testdata.join("build", "Skewer-0.6.jspkg");
        testing.truthy(packfile.exists(), "build/Skewer-0.6.jspkg should exist");
        var goodfile = testdata.join("lib", "skewer.js");
        testing.truthy(goodfile.exists(), "lib/skewer.js should have been installed");
    }
});