// somewhat more javascripty version of Java's ZipFile class.
// This should be turned into a proper API, ideally something consistent
// with an API for handling tarfiles. It also needs to be
// properly platform-aligned (allowing for platform-specific zip
// implementations)

var exc = require("./exc");
var log = require("./logger").log;

exports.ZipFile = function(file) {
    this.jZipFile = new java.util.zip.ZipFile(file);
}

exports.ZipFile.prototype = {
    close: function() {
        this.jZipFile.close();
    },
    // XXX this should return an iterator.
    entries: function() {
        var entries = [];
        var e = this.jZipFile.entries();
        while (e.hasMoreElements()) {
            entries.push(e.nextElement());
        }
        return entries;
    },
    saveFile: function(entry, destination) {
        if (destination.charAt(destination.toString().length - 1) == "/") {
            if (!destination.exists()) {
                destination.mkdirs();
            } else {
                if (!destination.isDirectory()) {
                    throw new exc.GetJSError("Destination directory " + destination + " exists, but is a file not a directory");
                }
            }
            return;
        }
        var istream = this.jZipFile.getInputStream(entry);
        var ostream = new java.io.FileOutputStream(destination);
        
        var buffer = new java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
        var len;
       
        while((len = istream.read(buffer)) >= 0)
            ostream.write(buffer, 0, len);
       
        istream.close();
        ostream.close();
    }
}