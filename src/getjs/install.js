var Repository = require("./repo").Repository;
var exc = require("./exc");
var log = require("./logger").log;
var json = require("json");
var ZipFile = require("./zipfile").ZipFile;
var file = require("file");

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
        var packagesDir = this.env.getDirectory("packages");
        
        var filelist = [];
        
        for (var i = 0; i < entries.length; i++) {
            entry = entries[i];
            
            if (dontinstall.exec(entry.name)) {
                return;
            }
            
            if (entry.name == "package.json") {
                destination = packagesDir.join(pack.name + ".json");
            } else {
                destination = root.join(entry.name);
            }
            
            filelist.push(root.to(destination));
            
            zf.saveFile(entry, destination);
        }
        zf.close();
        
        var fl = packagesDir.join(pack.name + ".filelist");
        filelist.push(root.to(fl));
        
        fl.write(json.encode(filelist));
    }
};
