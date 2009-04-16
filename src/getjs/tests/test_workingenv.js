var file = require("file");

// this is ugly.
var currentPaths = require.loader.getPaths();
var newPaths = [file.cwd()].concat(currentPaths);
require.loader.setPaths(newPaths);

var testing = require("getjs/testing");
var workingenv = require("getjs/workingenv");
var log = require("getjs/logger").log;

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
    setup: function() {
        recreateTestdata();
    },
    testCreateNew: function() {
        var we = new workingenv.WorkingEnv(testdata);
        var metadatadir = testdata.join(".getjs");
        testing.truthy(metadatadir.exists(), ".getjs directory should be there");
        var repos = we.getRepositories();
        testing.equal(1, repos.length);
    },
    testAddRepo: function() {
        var we = new workingenv.WorkingEnv(testdata);
        we.addRepository("/tmp/packages");
        
        // get a new WE to ensure that the data was saved
        var we = new workingenv.WorkingEnv(testdata);
        var repos = we.getRepositories();
        testing.equal(2, repos.length);
        testing.equal("/tmp/packages", repos[0], 
            "The new repo should be inserted at the front");
    },
    testAddRepoDoesNotAddDuplicate: function() {
        var we = new workingenv.WorkingEnv(testdata);
        var repos = we.getRepositories();
        var startingLength = repos.length;
        testing.truthy(repos.length > 0, "Expected at least one repo");
        we.addRepository(repos[0]);
        var r2 = we.getRepositories();
        testing.equal(startingLength, r2.length);
    }
});

