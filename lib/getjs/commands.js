var file = require("file");
var log = require("getjs/logger").log;
var WorkingEnv = require("getjs/workingenv").WorkingEnv;
var Installer = require("getjs/install").Installer;

var Command = function() {
    
}

Command.run = function() {
    // no op
}

var init = exports.init = function(args) {
    var directory = args[0];
    if (!directory) {
        directory = file.cwd();
    }
    this.directory = directory;
}

init.prototype = {
    description: "Initialize a new JavaScript environment.",
    getWorkingEnv: function() {
        return new WorkingEnv(this.directory);
    },
    run: function() {
        log.info("Initializing working environment");
    }
}

var help = exports.help = function(args) {
    
}

help.prototype = {
    description: "List the commands",
    run: function() {
        log.info("The following commands are available:\n")
        for (var cmd in exports) {
            var description = exports[cmd].prototype.description;
            log.info(cmd + " - " + description);
        }
    }
}

exports.addrepo = function(args) {
    this.repos = args;
}

exports.addrepo.prototype = {
    description: "Add repository location(s) to search for packages",
    run: function(env) {
        this.repos.forEach(function(repo) {
            env.addRepository(repo);
            log.info("Added repository: " + repo);
        });
    }
}

exports.listrepo = function(args) {
    
}

exports.listrepo.prototype = {
    description: "List package repositories",
    run: function(env) {
        var repos = env.getRepositories();
        log.info("Repositories:");
        repos.forEach(function(repo) {
            log.info(repo);
        });
    }
}
exports.clearrepo = function(args) {
    
}

exports.clearrepo.prototype = {
    description: "Clear the repository list",
    run: function(env) {
        env.clearRepositories();
        log.info("Repository list cleared.")
    }
}

exports.install = function(args) {
    this.names = args;
}

exports.install.prototype = {
    description: "Install packages",
    run: function(env) {
        var installer = new Installer(env);
        var names = this.names;
        var downloadinfos = [];
        
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            log.info("Downloading " + name);
            downloadinfos.push(installer.download(name));
        }
        
        for (i = 0; i < downloadinfos.length; i++) {
            var di = downloadinfos[i];
            log.info("Installing " + name);
            installer.install(di.pack, di.packFile, di.sourceFile);
        }
    }
}

exports.list = function(args) {
    
}

exports.list.prototype = {
    description: "List installed packages",
    run: function(env) {
        var packages = env.getInstalledPackages();
        for (var name in packages) {
            var pack = packages[name];
            log.info(pack.name + " " + pack.version.label);
        }
    }
}