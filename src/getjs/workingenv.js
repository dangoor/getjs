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
            this.metadata = eval('(' + rawdata + ')');
        } catch (e) {
            log.error("Argh! My metadata is corrupted! (Could not parse the JSON): " + e);
        }
    } else {
        this.metadata = {
            repositories: ["http://jshq.org/packages/index.json"]
        };
    }
}

WorkingEnv.prototype = {
    getRepositories: function() {
        var metadata = this.metadata;
        if (metadata && metadata.repositories) {
            return metadata.repositories;
        }
        return [];
    },
    addRepository: function(repo) {
        var metadata = this.metadata;
        if (!metadata) {
            metadata = this.metadata = {};
        }
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
    _saveMetadata: function() {
        // Note: there should be some kind of file locking here!
        var rawdata = json.encode(this.metadata);
        this.metadataFile.write(rawdata);
    }
}
