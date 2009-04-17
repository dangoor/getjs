var file = require("file");

// XXX this is ugly.
var currentPaths = require.loader.getPaths();
var newPaths = [file.cwd()].concat(currentPaths);
require.loader.setPaths(newPaths);

var testing = require("getjs/testing");
var install = require("getjs/install");
var WorkingEnv = require("getjs/workingenv").WorkingEnv;
var json = require("json");
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
    setup: recreateTestdata,
    
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
        
        var dontwant = testdata.join("package.json");
        testing.falsy(dontwant.exists(), 
            "package.json should not be installed at the root");
        
        var packagesDir = testdata.join(".getjs", "packages");
        var packageMeta = packagesDir.join("Skewer.json");
        testing.truthy(packageMeta.exists(), "Expected Skewer.json to be installed");
        
        var packageFilelist = packagesDir.join("Skewer.filelist");
        testing.truthy(packageFilelist.exists(), "Expected file list to be created");
        
        var rawdata = packageFilelist.read();
        var filelist = json.decode(rawdata.toString());
        testing.equal(4, filelist.length);
        testing.equal(".getjs/packages/Skewer.filelist", filelist[3]);
    }
});