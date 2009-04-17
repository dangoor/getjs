var file = require("file");

// XXX this is ugly.
var currentPaths = require.loader.getPaths();
var newPaths = [file.cwd()].concat(currentPaths);
require.loader.setPaths(newPaths);

var testing = require("getjs/testing");
var log = require("getjs/logger").log;
var Repository = require("getjs/repo").Repository;

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
    testGetLatestPackageInfo: function() {
        var location = "getjs/tests/packages/index.json";
        var r = new Repository(location);
        var pack = r.getPackageInfo("skewer");
        testing.itemsAreEqual([0,6], pack["version"].numeric);
    },
    testGetPackageFile: function() {
        var location = "getjs/tests/packages/index.json";
        var destination = testdata.join("build");
        var r = new Repository(location);
        var pack = r.getPackageInfo("skewer");
        var sourceFile = r.getPackageSource(pack);
        r.getPackageFile(sourceFile, pack, destination);
        testing.truthy(destination.exists());
    }
});