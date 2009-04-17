var Repository = require("./repo").Repository;
var exc = require("./exc");
var log = require("./logger").log;
var ZipFile = require("./zipfile").ZipFile;

exports.Installer = function(env) {
    this.env = env;
}

exports.Installer.prototype = {
    dontinstall: /^\.getjs/,
    
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
        
        this._installPackage(pack, packFile);
    },
    
    _installPackage: function(pack, packFile) {
        var dontinstall = this.dontinstall;
        var zf = new ZipFile(packFile);
        var entries = zf.entries();
        var root = this.env.root;
        
        var destination, entry;
        
        for (var i = 0; i < entries.length; i++) {
            entry = entries[i];
            
            if (dontinstall.exec(entry.name)) {
                return;
            }
            
            if (entry.name == "package.json") {
                var packagesDir = this.env.getDirectory("packages");
                destination = packagesDir.join(pack.name + ".json");
            } else {
                destination = root.join(entry.name);
            }
            
            zf.saveFile(entry, destination);
        }
        zf.close();
    }
};
