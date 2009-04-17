var Path = require("file").Path;
var exc = require("getjs/exc");
var log = require("getjs/logger").log;
var json = require("json");

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
    
    this.metadataFile = this.metadir.join("metadata.json");
    if (this.metadataFile.exists()) {
        var rawdata = this.metadataFile.read();
        try {
            this.metadata = json.decode(rawdata.toString());
        } catch (e) {
            throw new exc.GetJSError("Argh! My metadata is corrupted! (Could not parse the JSON): " + e);
        }
    } else {
        this.metadata = {
            repositories: ["http://jshq.org/packages/index.json"]
        };
    }
    
    if (!this.metadata.buildDir) {
        this.metadata.buildDir = workingPath.join("build");
    }
}

WorkingEnv.prototype = {
    // Get the list of repository locations used 
    // in this environment.
    getRepositories: function() {
        var metadata = this.metadata;
        if (metadata && metadata.repositories) {
            return metadata.repositories;
        }
        return [];
    },
    
    // Add a new repository location. Adds it
    // to the front of the list. (This is the
    // first one checked.)
    addRepository: function(repo) {
        var metadata = this.metadata;
        var repositories = metadata.repositories;
        if (!repositories) {
            repositories = metadata.repositories = [];
        }
        
        // don't add twice
        if (repositories.indexOf(repo) > -1) {
            return;
        }
        
        repositories.unshift(repo);
        this._saveMetadata();
    },
    
    // Clear the list of repositories. You would
    // use this if you want to set a new, explicit
    // list of repositories that does not include
    // any defaults.
    clearRepositories: function() {
        var metadata = this.metadata;
        metadata.repositories = [];
        this._saveMetadata();
    },
    
    // Get a Path object to a directory within
    // the metadata space. This is used for
    // other parts of getjs to store specific
    // metadata.
    getDirectory: function(dirname) {
        return this.metadir.join(dirname);
    },
    
    setBuildDir: function(dirname) {
        this.metadata.buildDir = Path(dirname);
        this._saveMetadata();
    },
    
    getBuildDir: function(dirname) {
        return Path(this.metadata.buildDir);
    },
    
    _saveMetadata: function() {
        // Note: there should be some kind of file locking here!
        var rawdata = json.encode(this.metadata);
        rawdata = rawdata.toBinary();
        this.metadataFile.write(rawdata);
    }
}
