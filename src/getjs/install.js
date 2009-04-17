var Repository = require("./repo").Repository;
var exc = require("./exc");
var log = require("./logger").log;
var ZipFile = require("./zipfile").ZipFile;

exports.Installer = function(env) {
    this.env = env;
}

exports.Installer.prototype = {
    install: function(name) {
        var repoLocations = this.env.getRepositories();
        var repos = [];
        repoLocations.forEach(function(rl) {
            repos.push(new Repository(rl));
        });
        
        var pack = null;
        var packFile = null;
        for (var i=0; i < repos.length; i++) {
            var pack = repos[i].getPackageInfo(name);
            if (pack) {
                packFile = repos[i].getPackageFile(pack, 
                                this.env.getBuildDir());
                break;
            }
        }
        
        if (!pack) {
            throw new GetJSError("Could not locate package " + name 
                                  + " in any repository");
        }
        
        this._installPackage(packFile);
    },
    
    _installPackage: function(packFile) {
        var zf = new ZipFile(packFile);
        var entries = zf.entries();
        var root = this.env.root;
        
        entries.forEach(function(entry) {
            var destination = root.join(entry.name);
            zf.saveFile(entry, destination);
        })
        zf.close();
    }
};
