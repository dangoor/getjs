= getjs =

This is the getjs JavaScript package system. With getjs, you will be able to
easily install JavaScript packages for any of the common JavaScript
interpreters supported at JSHQ.org.

== Package File Format ==

JavaScript packages are zip files with the extension .jspkg. At the top level,
there should be a {{{package.json}}} file that looks like this:

{{{
    {
        "name": "Your Cool Package",
        "author": "Your Name",
        "license": "MIT",
        "description": "The awesomest package you'll ever find. Makes toast.",
        "dependencies": ["OtherPackage >0.2"],
        "platform": 'all',
        "js": "lib",
        "scripts": {
            runme: "lib/mypkg/foo.js:bar"
        }
        "jars": ["jars/simple.jar"],
        "version": {
            "label": "1.0",
            "numeric": [1,0],
            "status": "stable"
        }
    }
}}}

{{{Description}}} should be a short description.

The {{{version}}} field can have the following statuses: "stable", "testing", 
"development".

The {{{scripts}}} field is an object with attributes that are the names of
scripts that should be generated. The generated script will run the
function referred to in the object. In the example above, the function
{{{bar}}} exported by the {{{lib/mypkg/foo.js}}} module will be run with
an array containing the command line arguments.

Additionally, the following files can be placed at the root:

; README.txt: a long description in Wiki Creole format that will be used for 
  display in the package index.
; install.js: a script to run after the files have been uncompressed.
; uninstall.js: a script to run before the previously installed files have 
  been removed.

== Installation data ==

getjs creates a directory called ".getjs" at the home directory of the
JavaScript environment.

In that directory, there is a file called metadata.json. It looks basically
like this:
{{{
    {
        "repositories": [
            "url", "url"
        ],
        "packages": {
            "packageName": {
                "from": "url"
                "version": {
                    "label": "1.0",
                    "numeric": [1,0]
                },
                "neededBy": ["Package1", "Package2"]
            }
        }
    }
}}}

packages/

PackageName.json -> the metadata file for that package
PackageName.filelist -> list of files installed with that package
