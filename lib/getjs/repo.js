var json = require("json");
var Path = require("file").Path;

exports.Repository = function(location) {
    this.loc = location;
    
    this._loadIndex();
}

exports.Repository.prototype = {
    _loadIndex: function() {
        var location = this.loc;
        // is this a file?
        if (location.indexOf("://") == -1) {
            var f = Path(location);
            var rawdata = f.read().toString();
        }
        this.packageInfo = json.decode(rawdata);
    },
    getPackageInfo: function(name, minimum, maximum) {
        name = name.toLowerCase();
        var packages = this.packageInfo[name];
        
        if (!packages) {
            return null;
        }
        var pack = null;
        var max_version = [0];
        for (var i = 0; i < packages.length; i++) {
            var p = packages[i];
            var v = p['version'].numeric;
            if (v > max_version) {
                pack = p;
                max_version = v;
            }
        }
        return pack;
    },
    getPackageSource: function(pack) {
        var sourceFile;
        var location = pack['location'];
        
        if (location.substring(0,1) == "/") {
            sourceFile = Path(location);
        } else if (location.indexOf("://") > -1) {
            // URL case, not yet dealt with
        } else {
            sourceFile = Path(this.loc).dirname().join(location);
        }
        return sourceFile;
    },
    getPackageFile: function(sourceFile, pack, destination) {
        if (!destination.exists()) {
            destination.mkdirs();
        }
        var destFile = destination.join(pack['filename']);
        if (destFile != sourceFile) {
            destFile.write(sourceFile.read());
        }
        return destFile;
    }
};