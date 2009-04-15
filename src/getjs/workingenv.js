var Path = require("file").Path;
var exc = require("getjs/exc");
var log = require("getjs/logger").log;

var WorkingEnv = exports.WorkingEnv = function(workingPath) {
    workingPath = Path(workingPath);
    this.root = workingPath;
    if (!workingPath.exists()) {
        log.debug("Creating directory: " + workingPath.path);
        workingPath.mkdirs();
    }
    if (!workingPath.isDirectory()) {
        throw new exc.GetJSError(workingPath.path + " exists, but is not a directory");
    }
    
    this.metadir = workingPath.join(".getjs");
    if (!this.metadir.exists()) {
        log.debug("Creating metadata directory: " + this.metadir.path);
        this.metadir.mkdir();
    }
}

