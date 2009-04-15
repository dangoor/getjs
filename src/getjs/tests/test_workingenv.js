var file = require("file");

// this is ugly.
var currentPaths = require.loader.getPaths();
var newPaths = [file.cwd()].concat(currentPaths);
require.loader.setPaths(newPaths);

var testing = require("getjs/testing");
var workingenv = require("getjs/workingenv");
var log = require("getjs/logger").log;

var testdata = new file.Path("testdata");

if (!testdata.exists()) {
    log.debug("Creating new directory: " + testdata.path);
    testdata.mkdirs();
} else {
    log.debug("Recreating directory: " + testdata.path);
    testdata.rmtree();
    testdata.mkdirs();
}

testing.run({
    testCreateNew: function() {
        var we = new workingenv.WorkingEnv(testdata);
        var metadatadir = testdata.join(".getjs");
        testing.truthy(metadatadir.exists(), ".getjs directory should be there");
    }
});

